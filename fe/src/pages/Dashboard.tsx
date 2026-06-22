import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeActiveRitual, deleteRituals, getRituals, postRituals } from "../services/rituals";
import React, { useState } from "react";

interface Ritual {
  id: string;
  title: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const QueryClient = useQueryClient();

  const [ritualName, setRitualName] =  useState('');

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
      })
    }
  })

  const { data, isPending, isError } = useQuery({
    queryKey: ["rituals"],
    queryFn: getRituals,
  });

  const rituals: Ritual[] = data?.rituals ?? [];

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="p-4 border-b">
        heatmap and charts
      </div>

      <div className="flex flex-1">
        <div className="flex-2 border p-4">
          ritual table
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
