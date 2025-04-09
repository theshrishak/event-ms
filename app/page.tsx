'use client';

import { useEffect, useState } from 'react';

import { getEvents, deleteEvent } from '@/services/event';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
}

export default function Home() {
  const [rows, setRows] = useState<Event[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [event, setEvent] = useState<Event>({
    id: "",
    title: "",
    description: "",
    date: new Date(),
    location: ""
  });

  const [options, setOptions] = useState({
    page: 0,
    total: 30
  });

  const retrieveEvents = async ()  => {
    const events = await getEvents({}, {
      page: options.page,
      limit: 10,
      sortBy: 'id',
      query: query
    });
    setRows(events);
  };

  useEffect(() => {
    retrieveEvents();
  }, [options]);

  return (
    <>
      {open && (
        <div className="modal relative z-50">
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-50 transition-opacity"></div>
            <div className="animate-translate min-h-screen flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative -top-10 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white p-5 text-center">
                  <h2 className="text-xl mt-5 text-gray-700">Delete Confirmation</h2>
                  <p className="text-gray-500 mt-2">
                    Are you sure you want to delete this event?
                  </p>
                  <p className="text-red-500 font-bold mt-2">
                    {event.title}
                  </p>
                  <div className="border-gray-50 mt-5 px-4 py-3 sm:flex justify-center sm:px-6">
                    <button
                      type="button"
                      className="cursor-pointer mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer inline-flex w-full justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        deleteEvent(event.id);
                        setOpen(false);
                        retrieveEvents();
                      }}
                    > 
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <div className="card">
            <div className="card-body">
              <div className="relative overflow-x-auto">
                <div className="ml-3 mt-3 pb-2 bg-white">
                  <input
                    placeholder="Search for events"
                    onChange={(e) => setQuery(e.target.value)}
                    className="shadow appearance-none border rounded w-[30%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-2"

                  />
                  <a
                    href="/create"
                    className="flex float-right p-2 rounded bg-blue-600 text-white mr-4"
                  >Create</a>
                </div>
                <table className="w-full text-sm text-left text-gray-500">
                  <thead
                    className="text-xs text-gray-700 uppercase bg-gray-50/50"
                  >
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="bg-white border-b border-gray-50 hover:bg-gray-50/50"
                    >
                      <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                        <div className="pl-3 text-left">
                          <div className="text-base font-semibold">{row.title}</div>
                          <div className="font-normal text-gray-500">{row.description}</div>
                        </div>  
                      </th>
                      <td className="px-6 py-4">
                      {new Date(row.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {row.location}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={"/edit/" + row.id}
                          className="font-medium text-blue-600 hover:underline"
                        >Edit</a>
                        <button
                          className="cursor-pointer font-medium text-red-600 hover:underline pl-2"
                          onClick={() => {
                            setOpen(true);
                            setEvent(row)}
                          }
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4">
                <div className="card-body">
                  <div className="flex flex-wrap gap-3 items-center place-content-between">
                    <div className="text-gray-500 font-medium">
                      <p>
                        Showing 
                        <strong className="text-gray-600 mx-1">1</strong> to 
                        <strong className="text-gray-600 mx-1">10</strong> of
                        <strong className="text-gray-600 mx-1">20</strong> result
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        className="btn text-gray-500 border-gray-100 hover:bg-gray-50/50 hover:text-gray-700"
                        onClick={() =>  {
                            if(options.page !== 0) {
                              setOptions({...options, page: options.page-1})
                            }
                        }}
                      >
                        Previous
                      </button>
                      <button
                        className="btn text-gray-500 border-gray-100 hover:bg-gray-50/50 hover:text-gray-700"
                        onClick={() =>  {
                            setOptions({...options, page: options.page+1})
                        }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}
