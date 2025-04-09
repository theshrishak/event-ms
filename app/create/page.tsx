"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Joi from 'joi';

import { createEvent } from '@/services/event';
import { validate } from '@/services/validate';


export default function EventCreatePage() {
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


  const handleInputChange = (e) => {
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
      delete newErrors[name];
      setErrors(newErrors);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(schema, event);
    if(validationErrors) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    createEvent(event.title, (new Date(event.date)).toISOString(), event.location, event.description);
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
        rows="10"
        onChange={handleInputChange}
        value={event.description}
      >
      </textarea>
      <button
        className="cursor-pointer bg-blue-600 mt-2 rounded text-white block p-2"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
}
