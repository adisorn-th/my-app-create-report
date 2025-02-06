import { NextApiRequest, NextApiResponse } from 'next';
import { POSTnoAUTH } from './main';

export const HealthRecordsbyHNEN = (data: any) => { return POSTnoAUTH("/HealthRecords/byHN", data) }
