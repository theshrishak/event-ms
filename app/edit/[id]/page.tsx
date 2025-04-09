"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Joi from 'joi';

import { updateEvent, getEventById } from '@/services/event';
import { validate } from '@/services/validate';

interface EventEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EventEditPage({ params }: EventEditPageProps) {
  const [errors, setErrors] = useState({});
  const [event, setEvent] = useState({
    title: "",
    date: "",
    location: "",
    description: ""
  });

  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required().label('title'),
    date: Joi.string().required().label('date'),
    location: Joi.string().min(3).required().label('location'),
    description: Joi.string().min(3).optional().label('description')
  });

  const router = useRouter();

  const retrieveEvent = async () => {
    const { id } = await params;
    const _event =  await getEventById(id);
    if(_event) {
      setEvent({
        title: _event.title,
        location: _event.location,
        description: _event.description,
        date: _event.date?.toISOString().split('T')[0]
      });
    }
  }

  useEffect(() => {
    retrieveEvent();
  }, []);


const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvent((prev) => ({
      ...prev,
      [name]:  value
    }));
    const fieldSchema = Joi.object({ [name]: schema.extract(name) });
    const { error } = fieldSchema.validate({ [name]: value });
    if (error) {
      setErrors({ ...errors, [name]: error.details[0].message });
    } else {
      const newErrors = { ...errors };
      setErrors(newErrors);
    }
  };


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(schema, event);
    if(validationErrors) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const { id } = await params;
    updateEvent(id, {...event, date: (new Date(event.date)).toISOString()});
    router.push('/');
  };


  return (
    <form className="ml-5 p-2" onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        name="title"
        className="shadow appearance-none border rounded w-[45%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-2 mr-5"
        onChange={handleInputChange}
        value={event.title}
      />
      <input
        placeholder="Date"
        type="date"
        name="date"
        className="shadow appearance-none border rounded w-[45%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-2 ml-5"
        onChange={handleInputChange}
        value={event.date}
      />
      <input
        placeholder="Location"
        name="location"
        className="shadow appearance-none border rounded w-[94%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-2 mt-2"
        onChange={handleInputChange}
        value={event.location}
      />
      <textarea
        placeholder="Description"
        name="description"
        className="shadow appearance-none border rounded w-[94%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-2 mt-2"
        rows={10}
        onChange={handleInputChange}
        value={event.description}
      >
      </textarea>
      <button
        className="cursor-pointer bg-blue-600 mt-2 rounded text-white block p-2"
        type="submit"
      >
        Edit
      </button>
    </form>
  );
}
