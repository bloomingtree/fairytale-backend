import { Bool, Num, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext, Story } from "../types";

export class StoryFetch extends OpenAPIRoute {
	schema = {
		tags: ["Story"],
		summary: "Fetch Story",
        request: {
            params: z.object({
                storyId: Num(),
            }),
        },
		responses: {
			"200": {
				description: "Returns a story",
				content: {
					"application/json": {
						schema: z.object({
							success: Bool(),
							result: Story,
						}),
					},
				},
			},
		},
	};
    async handle(c: AppContext) {
        const data = await this.getValidatedData<typeof this.schema>();
        const { storyId } = data.params;
        const db = c.env.DB;
        const story = await db
            .prepare('SELECT id, title, author, description, music_style, status, created_at, updated_at, image_path, tag FROM story where id = ? and deleted_at is null')
            .bind(storyId)
            .first();
        if (!story) {
            return c.json({ success: false, message: "Story not found" }, 404);
        }
        const chapters = await db
            .prepare('SELECT id, title, content, image_prompt, image_path, voice_path FROM chapter where story_id = ? and deleted_at is null')
            .bind(storyId)
            .all();
        story.chapters = chapters.results;
        return {
            success: true,
            result: story,
        };
    }
}