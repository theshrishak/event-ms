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
  const [errors, setErrors] = useState<Record<string,string>>({});
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
      if(newErrors.hasOwnProperty(name)) {
        delete newErrors[name];
      }
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
    <form
      className="mx-auto p-2 grid grid-cols-12 gap-4 w-[95%]"
      onSubmit={handleSubmit}
    >
      <div className="col-span-6">
        <input
          placeholder="Title (*)"
          name="title"
          className="w-[100%] shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-2"
          onChange={handleInputChange}
          value={event.title}
        />
        <span className="text-red-500 text-sm">{errors.title}</span>
      </div>
      <div className="col-span-6">
        <input
          placeholder="Date (*)"
          type="date"
          name="date"
          className="w-[100%] shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-2"
          onChange={handleInputChange}
          min={(new Date()).toISOString().split('T')[0]}
          value={event.date}
        />
        <span className="text-red-500 text-sm">{errors.date}</span>
      </div>
      <div className="col-span-12">
        <input
          placeholder="Location (*)"
          name="location"
          className="w-[100%] shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-2 mt-2"
          onChange={handleInputChange}
          value={event.location}
        />
        <span className="text-red-500 text-sm">{errors.location}</span>
      </div>
      <div className="col-span-12">
        <textarea
          placeholder="Description (*)"
          name="description"
          className="w-[100%] shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-2 mt-2"
          rows={10}
          onChange={handleInputChange}
          value={event.description}
        >
        </textarea>
        <span className="text-red-500 text-sm">{errors.description}</span>
      </div>
      <button
        className="cursor-pointer bg-blue-600 mt-2 rounded text-white block p-2 w-[5em]"
        type="submit"
      >
        Edit
      </button>
    </form>
  );
}
