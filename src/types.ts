import { DateTime, Str } from "chanfana";
import type { Context } from "hono";
import { z } from "zod";

export type AppContext = Context<{ Bindings: Env }>;

export interface Env {
  DB: D1Database; // 确保包含DB定义
  BUCKET: R2Bucket;
}

export const Task = z.object({
	name: Str({ example: "lorem" }),
	slug: Str(),
	description: Str({ required: false }),
	completed: z.boolean().default(false),
	due_date: DateTime(),
});

export const Chapter = z.object({
	id: z.number(),
	created_at: DateTime(),
	updated_at: DateTime(),
	deleted_at: DateTime().optional().nullable(),
	story_id: z.number(),
	title: Str({ example: "Chapter 1" }),
	content: Str({ example: "Once upon a time..." }),
	image_prompt: Str({ example: "A forest at dawn" }),
	image_path: Str({ example: "chapter1.png" }),
	voice_path: Str({ example: "chapter1.mp3" })
});

export const Story = z.object({
	id: z.number(),
	created_at: DateTime(),
	updated_at: DateTime(),
	deleted_at: DateTime().optional().nullable(),
	title: Str({ example: "The Adventure" }),
	author: Str({ example: "John Doe" }),
	description: Str({ example: "An exciting journey" }),
	music_style: Str({ example: "Epic" }),
	status: z.number(),
	chapters: Chapter.array(),
});

