import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeActiveRitual, deleteRituals, getRituals, postRituals } from "../services/rituals";
import React, {  useState } from "react";
import { getActiveLogs, getHeatMapLogs } from "../services/logs";
import ActiveLogsTable from "../components/ActiveTable";
import RitualCard from "../components/RitualCard";
import Heatmap from "../components/Heatmap";

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
  const uniqueDates = Object.keys(logsGroupedByDate).sort((a, b) => b.localeCompare(a));

  const rituals: Ritual[] = data?.rituals ?? [];

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="p-4 border-b">
        <h2>Activity Heatmap</h2>
        {
          heatmapPending && <Heatmap data={[]} />
        }
        {
          heatmapError &&<div><div>Error while fetching data</div> 
          <Heatmap data={[]} />
          </div>
        }
        {
          !heatmapPending && !heatmapError && <Heatmap data={heatmapData.heatmap}/>
        }
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
                <ActiveLogsTable
                  rituals={rituals}
                  logsGroupedByDate={logsGroupedByDate}
                  uniqueDates={uniqueDates}
                />
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
              <RitualCard
                key={ritual.id}
                ritual={ritual}
                onDelete={(ritualId) =>
                  deleteRitualMutation.mutate(
                    ritualId
                  )
                }
                onToggleActive={(
                  ritualId,
                  isActive
                ) =>
                  changeActiveMutation.mutate({
                    ritualId,
                    isActive,
                  })
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
