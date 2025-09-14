import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { StoryList } from "./endpoints/storyList";
import { StoryFetch } from "./endpoints/storyFetch";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
openapi.get("/api/story", StoryList);
openapi.get("/api/story/:storyId", StoryFetch);
openapi.post("/api/tasks", TaskCreate);
openapi.get("/api/tasks/:taskSlug", TaskFetch);
openapi.delete("/api/tasks/:taskSlug", TaskDelete);


// You may also register routes for non OpenAPI directly on Hono
app.get('/test', (c) => c.text('Hono!'))

// Export the Hono app
export default app;
