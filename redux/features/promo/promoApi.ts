import { baseApi } from "@/redux/api/baseApi";

type GetPromoLinksArgs = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isUsed?: string;
  mapId?: string;
  promoType?: string;
};

const promoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPromoLinks: builder.query<any, GetPromoLinksArgs>({
      query: ({ page = 1, limit = 10, searchTerm = "", isUsed = "", mapId = "", promoType = "" } = {}) => ({
        url: `/promo-links?page=${page}&limit=${limit}&searchTerm=${searchTerm}&isUsed=${isUsed}&mapId=${mapId}&promoType=${promoType}`,
        method: "GET",
      }),
      providesTags: ["Promo"],
    }),

    verifyPromoCode: builder.query<any, { code: string; mapId?: string }>({
      query: ({ code, mapId = "" }) => ({
        url: `/promo-links/verify?code=${code}&mapId=${mapId}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: "Promo" as const, id: arg.code }],
    }),

    claimFreePromo: builder.mutation<any, { code: string; mapId?: string }>({
      query: (data) => ({
        url: "/promo-links/claim",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Promo", "Map"], // invalidates maps to refresh list of purchased maps
    }),

    createPromoCheckoutSession: builder.mutation<any, { code: string; mapId?: string }>({
      query: (data) => ({
        url: "/promo-links/create-checkout-session",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Promo"],
    }),

    bulkGeneratePromos: builder.mutation<any, {
      mapId?: string | null;
      price: number;
      promoType?: "influencer" | "upgrade" | "custom";
      label: string;
      emails?: string[];
      count?: number;
      expiresAt?: string | null;
    }>({
      query: (data) => ({
        url: "/promo-links/bulk-generate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Promo"],
    }),

    sendBulkEmails: builder.mutation<any, { promoIds: string[] }>({
      query: (data) => ({
        url: "/promo-links/send-emails",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Promo"],
    }),
  }),
});

export const {
  useGetPromoLinksQuery,
  useLazyVerifyPromoCodeQuery,
  useVerifyPromoCodeQuery,
  useClaimFreePromoMutation,
  useCreatePromoCheckoutSessionMutation,
  useBulkGeneratePromosMutation,
  useSendBulkEmailsMutation,
} = promoApi;
