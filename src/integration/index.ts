import { AppType } from '@finalytic/integration-v1';
import { RentalApi } from './service';

export const integration: AppType = {
  config: async () => {
    return {
      id: 'demo',
      icon: `https://app.finalytic.io/favicon.ico`,
      name: 'Demo',
      type: 'service',
      authentication: {
        type: 'credentials',
        schema: {
          apiKey: {
            type: 'text',
            label: 'API Key',
          },
        },
      },
    };
  },
  async setup(event) {
    // const org = lodgify.getOrganization(event.payload.apiKey);
    const service = new RentalApi({
      onUpdateCredentials: async (credentials) => {
        await event.api.updateConnection({ credentials });
      },
      onUpdateState: async (persistentState) => {
        await event.api.updateConnection({ persistentState });
      },
      log: event.log,
      redirectUri: event.redirectUri,
      credentials: event.connection?.credentials,
      state: event.connection?.persistentState,
    });
    service.connect(event.payload);
    return {
      name: `Demo ${+new Date()}`, // org.name,
      // uniqueRef: toCamelCase(event.payload.name) || `${new Date()}`,
      credentials: { ...event.payload },
      persistentState: {},
    };
  },
  async fetch(event) {
    event.log.info('Fetching data');

    const service = new RentalApi({
      onUpdateCredentials: async (credentials) => {
        await event.api.updateConnection({ credentials });
      },
      onUpdateState: async (persistentState) => {
        await event.api.updateConnection({ persistentState });
      },
      log: event.log,
      redirectUri: event.redirectUri,
      credentials: event.connection.credentials,
      state: event.connection.persistentState,
    });

    const items = await service.getUnits();
    console.log(`Rooms ${items.length}`);

    const listings = await event.api.insertListings(
      items.map((listing) => {
        return {
          uniqueRef: `${listing.id}`,
          name: listing.name,
          address: listing.address,
          connections: {
            data: [
              {
                connectionId: event.connection.id,
                uniqueRef: `${listing.id}`,
                name: listing.name,
                nickname: `${listing.name}`,
                address: listing.address,
              },
            ],
          },
        };
      }),
      true
    );

    const listingConnectionByUniqueRef = listings.reduce<{[s: string]: string}>((acc, listing) => {
      listing.connections.forEach(x => acc[x.uniqueRef] = x.id);
      return acc;
    }, {});

    /*const lastUpdated =
      event.connection.persistentState.reservationUpdatedAt ||
      dayjs().add(-3, 'month').format('YYYY-MM-DD');

    event.api.insertReservations([
      {
        confirmationCode: '',
        checkIn: '',
        checkOut: '',
        guestName: '',
        listingConnectionId: listingConnectionByUniqueRef[`${reservation.roomId}`]
      },
    ]);

    await event.api.updateConnection({
      persistentState: { reservationUpdatedAt: dayjs().format('YYYY-MM-DD') },
    });*/

    /*event.api.insertPayment([{
      confirmationCode: '',
      checkIn: '',
      checkOut: '',
      guestName: '',
      listingConnectionId: ''
    }])*/
  },
};
