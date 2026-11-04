import { z } from 'zod';
import { BIO_MAX, DISPLAY_NAME_MAX } from './constants';

export function ageFrom(birthDate: string, now = new Date()): number {
  const b = new Date(`${birthDate}T00:00:00`);
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}

const LINK_RE = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|gg|br|xyz|ly)\b)/i;

// Mesmos schemas serão reaproveitados nas rotas do servidor (Fase 2).
export const accountSchema = z.object({
  email: z.string().trim().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo de 8 caracteres'),
});

export const basicsSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Mínimo de 2 caracteres')
    .max(DISPLAY_NAME_MAX, `Máximo de ${DISPLAY_NAME_MAX} caracteres`)
    .regex(/^[^<>]*$/, 'Caracteres < e > não são permitidos'),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe sua data de nascimento')
    .refine((d) => ageFrom(d) >= 18, 'O DuoMatch é só para maiores de 18 anos')
    .refine((d) => ageFrom(d) <= 100, 'Data inválida'),
  adultConfirmed: z.literal(true, { errorMap: () => ({ message: 'Confirme que você tem 18 anos ou mais' }) }),
});

export const bioSchema = z
  .string()
  .max(BIO_MAX, `Máximo de ${BIO_MAX} caracteres`)
  .refine((s) => !/<[^>]+>/.test(s), 'HTML não é permitido')
  .refine((s) => !LINK_RE.test(s), 'Links não são permitidos na bio');

export const riotIdSchema = z
  .string()
  .trim()
  .refine((s) => s === '' || /^[^#]{3,16}#[A-Za-z0-9]{2,5}$/.test(s), 'Formato esperado: Nome#TAG');

export function firstError(r: z.SafeParseReturnType<unknown, unknown>): Record<string, string> {
  if (r.success) return {};
  const out: Record<string, string> = {};
  for (const issue of r.error.issues) out[issue.path.join('.') || '_'] ??= issue.message;
  return out;
}

type ProfileDraft = {
  displayName: string;
  birthDate: string;
  bio: string;
  photos: unknown[];
  intents: unknown[];
  lol: { riotId: string };
};

/** Erros por campo do perfil completo (cadastro e edição). */
export function validateProfile(p: ProfileDraft, adultConfirmed = true): Record<string, string> {
  const errors: Record<string, string> = {
    ...firstError(basicsSchema.safeParse({ displayName: p.displayName, birthDate: p.birthDate, adultConfirmed })),
  };
  const bio = bioSchema.safeParse(p.bio);
  if (!bio.success) errors.bio = bio.error.issues[0].message;
  const riot = riotIdSchema.safeParse(p.lol.riotId);
  if (!riot.success) errors.riotId = riot.error.issues[0].message;
  if (!p.photos.length) errors.photos = 'Adicione pelo menos 1 foto';
  if (!p.intents.length) errors.intents = 'Escolha pelo menos um objetivo';
  return errors;
}
