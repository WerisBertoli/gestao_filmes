import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ImdbIdBodySchema = z.object({
  imdbId: z
    .string()
    .min(1, 'imdbId obrigatório')
    .regex(/^tt\d+$/i, 'imdbId deve começar com tt seguido de dígitos'),
});

export class ImdbIdBodyDto extends createZodDto(ImdbIdBodySchema) {}
