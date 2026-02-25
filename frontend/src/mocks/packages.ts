import type { SearchWithPackagesResponse } from '@/types/packages'

export const mockPackageSearchResults: SearchWithPackagesResponse = {
  totalResults: 8,
  spId: '855e13c7-0f9c-4051-8df6-7f2f3ccf4dd6',
  sId: '8e508228-a7d9-4c25-8553-764d7269cd62',
  searchStatus: 'COMPLETED',
  currency: 'SAR',
  searchResults: [
    {
      hotelId: '1404585',
      countryCode: 'AE',
      packages: [
        {
          packageId: '534992f8-4833-4951-bad1-ee612a555ef6',
          refundability: 'Refundable',
          rooms: [
            {
              numberOfAdults: 2,
              kidsAges: [],
              roomBasis: 'Room Only',
              roomId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              roomName: {
                en: 'Deluxe King Room',
                ar: 'غرفة ديلوكس كينج',
              },
              originalRoomName: 'Deluxe King Room',
              roomRateInfo: {
                total: 450,
                roomNightlyRates: [
                  { rate: 150 },
                  { rate: 150 },
                  { rate: 150 },
                ],
              },
            },
          ],
          packageRateInfo: {
            total: 450,
            currency: 'SAR',
            netPrice: 380,
            sellingPriceMandatory: true,
            packageNightlyRates: [
              { rate: 150 },
              { rate: 150 },
              { rate: 150 },
            ],
            vatDetail: {
              vatAmount: 70,
              percentage: 15,
              action: 'APPLIED',
            },
          },
          cancellationPolicy: {
            bookingRemarks: 'Free cancellation until 24 hours before check-in',
            cancellationPolicyDetails: [
              {
                cancellationFee: {
                  currency: 'SAR',
                  finalPrice: 0,
                  netPrice: 0,
                  sellingPriceMandatory: true,
                },
                dateFrom: '2026-03-10T00:00:00.000Z',
                dateTo: '2026-03-14T14:00:00.000Z',
              },
              {
                cancellationFee: {
                  currency: 'SAR',
                  finalPrice: 450,
                  netPrice: 380,
                  sellingPriceMandatory: true,
                },
                dateFrom: '2026-03-14T14:00:00.000Z',
                dateTo: '2026-03-15T14:00:00.000Z',
              },
            ],
          },
        },
        {
          packageId: '635af3b9-5944-4a62-bc2e-ff723b666fa7',
          refundability: 'Nonrefundable',
          rooms: [
            {
              numberOfAdults: 2,
              kidsAges: [],
              roomBasis: 'Bed & Breakfast',
              roomId: '4gb96f75-6828-4673-c4gd-3d074g77bgb7',
              roomName: {
                en: 'Superior Double Room with Breakfast',
                ar: 'غرفة مزدوجة متفوقة مع الإفطار',
              },
              originalRoomName: 'Superior Double Room with Breakfast',
              roomRateInfo: {
                total: 380,
                roomNightlyRates: [
                  { rate: 127 },
                  { rate: 127 },
                  { rate: 126 },
                ],
              },
            },
          ],
          packageRateInfo: {
            total: 380,
            currency: 'SAR',
            netPrice: 320,
            sellingPriceMandatory: true,
            packageNightlyRates: [
              { rate: 127 },
              { rate: 127 },
              { rate: 126 },
            ],
            vatDetail: {
              vatAmount: 60,
              percentage: 15,
              action: 'APPLIED',
            },
          },
          cancellationPolicy: {
            bookingRemarks: 'Non-refundable rate',
            cancellationPolicyDetails: [
              {
                cancellationFee: {
                  currency: 'SAR',
                  finalPrice: 380,
                  netPrice: 320,
                  sellingPriceMandatory: true,
                },
                dateFrom: '2026-03-10T00:00:00.000Z',
                dateTo: '2026-03-15T14:00:00.000Z',
              },
            ],
          },
        },
      ],
    },
    {
      hotelId: '2305694',
      countryCode: 'AE',
      packages: [
        {
          packageId: '746aa4c0-6055-5b73-cd3f-gg834c888gb8',
          refundability: 'Refundable',
          rooms: [
            {
              numberOfAdults: 2,
              kidsAges: [5],
              roomBasis: 'Half Board',
              roomId: '5hc07g86-7939-5784-d5he-4e185h88chc8',
              roomName: {
                en: 'Family Room with Half Board',
                ar: 'غرفة عائلية مع نصف إقامة',
              },
              originalRoomName: 'Family Room with Half Board',
              roomRateInfo: {
                total: 720,
                roomNightlyRates: [
                  { rate: 240 },
                  { rate: 240 },
                  { rate: 240 },
                ],
              },
            },
          ],
          packageRateInfo: {
            total: 720,
            currency: 'SAR',
            netPrice: 600,
            sellingPriceMandatory: true,
            packageNightlyRates: [
              { rate: 240 },
              { rate: 240 },
              { rate: 240 },
            ],
            vatDetail: {
              vatAmount: 120,
              percentage: 15,
              action: 'APPLIED',
            },
          },
          cancellationPolicy: {
            bookingRemarks: 'Free cancellation until 48 hours before check-in',
            cancellationPolicyDetails: [
              {
                cancellationFee: {
                  currency: 'SAR',
                  finalPrice: 0,
                  netPrice: 0,
                  sellingPriceMandatory: true,
                },
                dateFrom: '2026-03-10T00:00:00.000Z',
                dateTo: '2026-03-13T14:00:00.000Z',
              },
              {
                cancellationFee: {
                  currency: 'SAR',
                  finalPrice: 720,
                  netPrice: 600,
                  sellingPriceMandatory: true,
                },
                dateFrom: '2026-03-13T14:00:00.000Z',
                dateTo: '2026-03-15T14:00:00.000Z',
              },
            ],
          },
        },
      ],
    },
  ],
}
