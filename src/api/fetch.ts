import {
  CARS_PER_PAGE,
  DEFAULT_INCREMENT,
  WINNERS_PER_PAGE,
} from '../models/constants';
import { Car, GarageResponse, Winner, WinnersResponse } from '../models/models';
import Endpoints from './endpoints';
import { WrongResponse, ServerError, httpStatus } from './errors';

export async function getCars(page: number): Promise<GarageResponse> {
  const endpoint = `${Endpoints.garage}?_page=${page}&_limit=${CARS_PER_PAGE}`;
  const response = await fetch(endpoint);
  let garageResponse: GarageResponse;
  if (response.ok) {
    const cars: unknown = await response.json();
    const totalCount = response.headers.get('X-Total-Count');
    if (cars != null) {
      if (Array.isArray(cars) && totalCount) {
        garageResponse = {
          cars: cars as Car[],
          totalCount: Number.parseInt(totalCount, 10),
        };
        return garageResponse;
      }
      throw new Error(`got type different from garage response`);
    }
  }
  return Promise.reject(
    new Error(`can't get cars: ${response.status}: ${response.statusText}`)
  );
}

export async function getCar(carID: number): Promise<Car> {
  const getCarResponse = await fetch(`${Endpoints.garage}/${carID}`);
  if (getCarResponse.ok) {
    return (await getCarResponse.json()) as Car;
  }
  return Promise.reject(
    new WrongResponse(
      `can't get car with id: ${carID} server sent: ${getCarResponse.statusText}`
    )
  );
}

export async function updateCar(
  carID: number,
  newData: { name: string; color: string }
) {
  const updateResponse = await fetch(`${Endpoints.garage}/${carID}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    body: JSON.stringify(newData),
  });
  return updateResponse.ok;
}

export async function removeWinner(carID: number) {
  await fetch(`${Endpoints.winners}/${carID}`, {
    method: 'DELETE',
  });
}

export async function removeCar(carID: number) {
  const removeCarEndpoint = `${Endpoints.garage}/${carID}`;
  const getCarResponse = await fetch(removeCarEndpoint, {
    method: 'DELETE',
  });
  if (getCarResponse.ok) {
    await removeWinner(carID);
  }
}

export async function requestToStartStop(
  carID: number,
  stop = false
): Promise<number> {
  const status = stop ? 'stopped' : 'started';
  const toStartEndpoint = `${Endpoints.engine}?id=${carID}&status=${status}`;
  const startResponse = await fetch(toStartEndpoint, { method: 'PATCH' });
  if (startResponse.ok) {
    type RaceData = { velocity: number; distance: number };
    const raceData = (await startResponse.json()) as RaceData;
    if (raceData) {
      const zero = 0;
      return raceData.velocity !== zero
        ? raceData.distance / raceData.velocity
        : raceData.velocity;
    }
  }
  const errorText = await startResponse.text();
  return Promise.reject(new WrongResponse(errorText));
}

export async function requestToDrive(carID: number): Promise<boolean> {
  const toDriveEndpoint = `${Endpoints.engine}?id=${carID}&status=drive`;
  const driveResponse = await fetch(toDriveEndpoint, { method: 'PATCH' });
  if (driveResponse.ok || driveResponse.status === httpStatus.toManyRequests) {
    return true;
  }
  if (driveResponse.status === httpStatus.internalServerError) {
    return Promise.reject(new ServerError('car broken'));
  }
  const errorText = await driveResponse.text();
  return Promise.reject(new WrongResponse(errorText));
}

async function createWinner({ id, wins, time }: Winner) {
  const createWinnerResponse = await fetch(`${Endpoints.winners}`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ id, wins, time }),
  });
  return createWinnerResponse;
}

export async function writeWinner(
  carID: number,
  time: number
): Promise<Winner> {
  const getWinnerEndpoint = `${Endpoints.winners}/${carID}`;
  const getWinnerResponse = await fetch(getWinnerEndpoint);
  let errorsString = '';
  let getWinnerResult: Winner;
  if (getWinnerResponse.ok) {
    getWinnerResult = (await getWinnerResponse.json()) as Winner;
    const bestTime = getWinnerResult.time < time ? getWinnerResult.time : time;
    const updateWinner = await fetch(getWinnerEndpoint, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        wins: getWinnerResult.wins + DEFAULT_INCREMENT,
        time: bestTime,
      }),
    });
    if (updateWinner.ok) {
      return (await updateWinner.json()) as Winner;
    }
    errorsString += `error update winner: ${updateWinner.status} - ${updateWinner.statusText}\n`;
  }
  if (getWinnerResponse.status === httpStatus.notFound) {
    const createWinnerResponse = await createWinner({
      id: carID,
      wins: 1,
      time,
    });
    if (createWinnerResponse.ok) {
      return (await createWinnerResponse.json()) as Winner;
    }
    errorsString += `error create new winner: ${createWinnerResponse.status} - ${createWinnerResponse.statusText}\n`;
  }
  errorsString += `error get winner: ${getWinnerResponse.status} - ${getWinnerResponse.statusText}`;
  return Promise.reject(new WrongResponse(errorsString));
}

export async function createCar(params: { name: string; color: string }) {
  const createCarEndpoint = `${Endpoints.garage}`;
  const createCarResponse = await fetch(createCarEndpoint, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (createCarResponse.ok) {
    return (await createCarResponse.json()) as Car;
  }
  return Promise.reject(
    new WrongResponse(`can't create car ${params.name} [${params.color}]`)
  );
}

export async function getWinners(
  page: number,
  sort: 'id' | 'wins' | 'time',
  order: 'ASC' | 'DESC' = 'ASC'
): Promise<WinnersResponse> {
  const getWinnersEndpoint = `${Endpoints.winners}?_page=${page}&_limit=${WINNERS_PER_PAGE}&_sort=${sort}&_order=${order}`;
  const getWinnersResponse = await fetch(getWinnersEndpoint);
  if (getWinnersResponse.ok) {
    const data: unknown = await getWinnersResponse.json();
    const totalCount = getWinnersResponse.headers.get('X-Total-Count');
    if (!totalCount) {
      return Promise.reject<WinnersResponse>(
        new WrongResponse('server not sent total winners in header')
      );
    }
    if (data && data instanceof Array) {
      return {
        winners: data as Winner[],
        totalCount: parseInt(totalCount, 10),
      };
    }
  }
  return Promise.reject<WinnersResponse>(
    new WrongResponse(
      `server sent: ${getWinnersResponse.status} - ${getWinnersResponse.statusText}`
    )
  );
}
