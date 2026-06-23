import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeActiveRitual, deleteRituals, getRituals, postRituals } from "../services/rituals";
import React, {  useState } from "react";
import { getActiveLogs, getHeatMapLogs } from "../services/logs";


interface Ritual {
  id: string;
  title: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface RitualInfo {
  title: string;
  isActive: boolean;
}

// The shape of a single log item from your JSON array
interface Log {
  id: string;
  userId: string;
  ritualId: string;
  date: string;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  ritual: RitualInfo;
}

type GroupedLogs = Record<string, Record<string, number | null>>;

const Dashboard = () => {
  const QueryClient = useQueryClient();

  const [ritualName, setRitualName] =  useState('');

  const {
    data: activeLogs,
    isPending: activeLogsPending,
    isError: activeLogsError,
  } = useQuery({
    queryKey: ["activeLogs"],
    queryFn: getActiveLogs,
  });

  const {
    data: heatmapData,
    isPending: heatmapPending,
    isError: heatmapError,
  } = useQuery({
    queryKey: ["heatmap"],
    queryFn: getHeatMapLogs,
  });

  // const postLogsMutation = useMutation({
  //   mutationFn : postLogsHandler,

  // })


  const postRitualMutation = useMutation({
    mutationFn : postRituals,

    onSuccess : ()=>{
      QueryClient.invalidateQueries({
        queryKey:['rituals']
      })

      setRitualName('')
    }

  })

  const deleteRitualMutation = useMutation({
    mutationFn : deleteRituals,

    onSuccess : ()=>{
      QueryClient.invalidateQueries({
        queryKey:['rituals']
      })
    }
  })

  const changeActiveMutation = useMutation({
    mutationFn : changeActiveRitual,

    onSuccess: ()=>{
      QueryClient.invalidateQueries({
        queryKey:['rituals']
        //change the activeMutationLogs :)
      })
    }
  })

  const { data, isPending, isError } = useQuery({
    queryKey: ["rituals"],
    queryFn: getRituals,
  });

  const safeLogs = (activeLogs?.logs as Log[]) || [];

  const logsGroupedByDate = safeLogs.reduce<GroupedLogs>((acc, log) => {
    // Extract just the YYYY-MM-DD part of the date for clean grouping
    const dateStr = log.date.split('T')[0];

    if (!acc[dateStr]) {
      acc[dateStr] = {};
    }

    // Assign the score to the specific ritual title for this date
    acc[dateStr][log.ritual.title] = log.score;

    return acc;
  }, {});

  // 2. Get a sorted array of unique dates to act as our rows
  const uniqueDates = Object.keys(logsGroupedByDate).sort();

  const rituals: Ritual[] = data?.rituals ?? [];

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="p-4 border-b">
        heatmap and charts
      </div>

      <div className="flex flex-1">
        <div className="flex-2 border p-4">
          {
            activeLogsPending && (<div>Loading...</div>)
          }

          {
            activeLogsError && (<div>Error in getting Active logs</div>)
          }

          {
            !activeLogsPending && !activeLogsError && (<div>
              {
                <div>
                  <div>Active Logs Section</div>
                  <table>
                    <thead>
                      <tr>
                        <th className="border p-2 bg-orange-300">Date</th>
                        {rituals.map(ritual => (
                          ritual.isActive && (
                            <th key={ritual.title} className="border p-2">
                              {ritual.title}
                            </th>
                          )
                        ))}
                        {/* Assuming this last column is meant for a Daily Total Score */}
                        <th className="border p-2 bg-green-300">Total Score</th>
                      </tr>
                    </thead>

                    <tbody>
                      {/* Map over our grouped dates to create rows */}
                      {uniqueDates.map(date => {
                        const dailyScores = logsGroupedByDate[date];

                        return (
                          <tr key={date}>
                            {/* 1. Date Column */}
                            <td className="border p-2 bg-orange-300">{date}</td>

                            {/* 2. Ritual Score Columns */}
                            {rituals.map(ritual => {
                              if (!ritual.isActive) return null;

                              // Look up the score for this ritual on this specific date
                              const score = dailyScores[ritual.title];

                              return (
                                <td key={ritual.title} className="border p-2 text-center">
                                  {/* If score is null or undefined, render a dash */}
                                  {score !== undefined && score !== null ? score : '-'}
                                </td>
                              );
                            })}

                            {/* 3. Daily Total Score Column (Optional) */}
                            <td className="border p-2 bg-green-300 text-center font-bold">
                              {rituals.reduce((total, ritual) => {
                                // 1. Extract the score into a local variable first
                                const score = dailyScores[ritual.title];

                                // 2. Check if ritual is active AND the score is explicitly a number
                                if (ritual.isActive && typeof score === 'number') {
                                  return total + score;
                                }

                                // If it's null, undefined, or inactive, just return the current total
                                return total;
                              }, 0)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              }
            </div>)
          }
        </div>

        <div className="flex-1 border p-4">
          <div>
            <input value={ritualName} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setRitualName(e.target.value)}} className="border" placeholder="Ritual Name" />
            <button onClick={()=>{
              postRitualMutation.mutate(ritualName)}} className="bg-green-600 border m-2">Add Ritual</button>
          </div>

          {isPending && (
            <div>Loading rituals...</div>
          )}

          {isError && (
            <div>Error fetching rituals</div>
          )}

          {!isPending && !isError && rituals.length === 0 && (
            <div>No rituals found</div>
          )}

          {!isPending &&
            !isError &&
            rituals.map((ritual) => (
              <div
                key={ritual.id}
                className="border rounded p-2 mb-2"
              >
                <div>{ritual.title}</div>
                <div className="flex">
                  <div className="flex-4">
                    {ritual.isActive
                      ? <button className="border" onClick={() => { 
                        console.log("clicked", ritual.id);
                        changeActiveMutation.mutate({ ritualId: ritual.id, isActive: false }) 
                      }}>🟢 Active</button>
                      : <button className="border" onClick={() => { changeActiveMutation.mutate({ ritualId: ritual.id, isActive: true }) }}>⚫ Inactive</button>}
                  </div>
                  <button onClick={() => { deleteRitualMutation.mutate(ritual.id)}} className="bg-red-600 flex-1">Delete</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
