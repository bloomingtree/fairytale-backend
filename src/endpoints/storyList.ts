import { Bool, Num, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext, Story } from "../types";

export class StoryList extends OpenAPIRoute {
	schema = {
		tags: ["Story"],
		summary: "List Story",
		request: {
			query: z.object({
				page: Num({
					description: "Page number",
					default: 0,
				}),
			}),
		},
		responses: {
			"200": {
				description: "Returns a list of story",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: Bool(),
								result: z.object({
									story: Story.array(),
								}),
							}),
						}),
					},
				},
			},
		},
	};

	async handle(c: AppContext) {
		// Get validated data
		const data = await this.getValidatedData<typeof this.schema>();

		// Retrieve the validated parameters
		const { page } = data.query;
		const db = c.env.DB;
		const stories = await db
			.prepare('SELECT id, title, author, description, music_style, status, created_at, updated_at, image_path, tag FROM story where deleted_at is null limit 10 offset ?')
			.bind(page * 10)
			.all();
		return {
			success: true,
			story: stories.results,
		};
	}
}
