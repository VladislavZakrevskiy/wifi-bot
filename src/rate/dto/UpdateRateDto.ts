import { CreateRateDto } from './CreateRateDto';

export type UpdateRateDto = Partial<CreateRateDto> & { id: string };
