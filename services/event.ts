"use server";
import prisma from './prisma';
import { revalidatePath } from 'next/cache';
import { currentUser } from '@clerk/nextjs/server';

export const createEvent = async (
    title: string, date: string, location: string, description: string
) => {
    const user = await currentUser();
    const userId = user.id;
    const event = await prisma.events.create({
        data: {
            title,
            description,
            date,
            location,
            userId
        }
    });
};

export const getEventById = async (
    id: number
) => {
    return prisma.events.findUnique({
        where: { id }
    });
};

export const getEvents = async (
    filter: object,
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
        query?: string;
        sortType?: 'asc' | 'desc'
    }
) => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 30;
    const sortBy = options.sortBy;
    const sortType = options.sortType ?? 'desc';
    const user = await currentUser();
    const role = user['_raw']['public_metadata']?.role;
    if(!!role && role !== 'Admin') {
        filter = {
            ...filter,
            userId: user['id']
        }
    }
    const events = await prisma.events.findMany({
        where: filter,
        skip: page * limit,
        take: limit,
        orderBy: !!sortBy ? { [sortBy]: sortType } : undefined
    });
    return events;
};

export const deleteEvent = async (
    eventId: string
) => {
    return await prisma.events.delete({
        where: {
            id: eventId
        }
    });
};

export const updateEvent = async (
    eventId: number,
    updateEvent: Prisma.EventsUpdateInput
) => {
    const updatedEvent = await prisma.events.update({
        where: { id: eventId },
        data: updateEvent
    });
    return updatedEvent;
};
