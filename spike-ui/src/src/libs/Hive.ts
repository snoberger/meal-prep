import axios from 'axios';
import { ENDPOINT } from './consts';

export interface HiveItem {
    inspectionResults?: string,
    health?: string,
    honeyStores?: string,
    queenProduction?: string,
    hiveEquipment?: string,
    inventoryEqipment?: string,
    losses?: string,
    gains?: string,
    viewable?: boolean
    name?: string
}

export interface HiveItemResult extends HiveItem {
    hiveId: string,
    userId: string
    updateTs: string,
    createTs: string
}

export interface DBHiveResponse {
    Items: HiveItemResult[],
    Count: number,
    ScannedCount: number
}

export interface HiveResponse {
    config: {},
    data: DBHiveResponse
    headers: {},
    request: XMLHttpRequest,
    status: number,
    statusText: string
}

export const HIVE_ENDPOINT = `${ENDPOINT}/hive`;

export const create = async (userId: string, hive: HiveItem): Promise<HiveResponse> => {
    return await axios.post(HIVE_ENDPOINT, {'userId': userId, ...hive});
}

export const getUsersHives = async (userId: string): Promise<HiveResponse> => {
    return await axios.get(`${HIVE_ENDPOINT}/${userId}`);
}

export const getSpecifiedHive = async (userId: string, hiveId: string): Promise<HiveResponse> => {
    return await axios.get(`${HIVE_ENDPOINT}/${userId}/${hiveId}`);
}

export const updateHive = async (userId: string, hiveId: string, hive: HiveItem): Promise<HiveResponse> => {
    console.log(hive,hiveId,userId, 'shit', {...hive})
    return await axios.patch(`${HIVE_ENDPOINT}/${userId}/${hiveId}`, {...hive});
}

export const deleteHive = async (userId: string, hiveId: string): Promise<HiveResponse> => {
    return await axios.delete(`${HIVE_ENDPOINT}/${userId}/${hiveId}`);
}
