import WebPush from "web-push";
import { FastifyInstance } from "fastify";
import { z } from "zod";

const publicKey =
  "BHz3YTayrAwfxNXX-gxrDsxEUNIpUJ_QsFL7qe-XQDCok-7dOPuLkQBNFlm78ssFCYr1BCqbLX-iKt72R4XHSA4";
const privateKey = "W7EX5VBvHJM3Uso8kGO0xBBTVY8ncPvkGNTkVvpTZb8";

WebPush.setVapidDetails("http://localhost:3333", publicKey, privateKey);

export async function notificationsRoutes(app: FastifyInstance) {
  app.get("/push/public_key", () => {
    return {
      publicKey,
    };
  });

  app.post("/push/register", (request, reply) => {
    // criar uma tabela no prisma e salvar a subscription
    console.log(request.body);

    return reply.status(201).send();
  });

  app.post("/push/send", (request, reply) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
      }),
    });

    const { subscription } = sendPushBody.parse(request.body);

    setTimeout(() => {
      WebPush.sendNotification(subscription, "Hello do backend");
    }, 5000);

    return reply.status(201).send();
  });
}
