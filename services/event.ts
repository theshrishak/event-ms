"use server";
import prisma from './prisma';
import { Events, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { currentUser } from '@clerk/nextjs/server';

export const createEvent = async (
    title: string, date: string, location: string, description: string
) => {
    const user = await currentUser();
    if(!user) return;
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
    id: string
): Promise<Events | null> => {
    return prisma.events.findUnique({
        where: { id }
    });
};

interface EventList {
    results: Events[]
    total: number
}

export const getEvents = async (
    filter: object,
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
        query?: string;
        sortType?: 'asc' | 'desc'
    }
): Promise<EventList>  => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 30;
    const sortBy = options.sortBy;
    const sortType = options.sortType ?? 'desc';
    const query = options.query ?? '';
    const user = await currentUser();
    if(!user) return { results: [], total: 0};
    const role = user['_raw']['public_metadata']?.role;
    if(!role || role !== 'Admin') {
        filter = {
            ...filter,
            userId: user['id']
        }
    }
    filter = {
        ...filter,
        OR: [
            { title: { 
                contains: query ,
                mode: 'insensitive'
            } },
            { location: { 
                contains: query ,
                mode: 'insensitive'
            } },
            { description: { 
                contains: query,
                mode: 'insensitive'
            } },
        ]
    }
    const events = await prisma.events.findMany({
        where: filter,
        skip: page * limit,
        take: limit,
        orderBy: !!sortBy ? { [sortBy]: sortType } : undefined
    });
    return {
        "results": events,
        "total": await prisma.events.count({ where: filter })
    };
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
    eventId: string,
    updateEvent: Prisma.EventsUpdateInput
) => {
    const updatedEvent = await prisma.events.update({
        where: { id: eventId },
        data: updateEvent
    });
    return updatedEvent;
};
