"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HydrationBoundary, type DehydratedState } from "@tanstack/react-query";

interface ProvidersProps {
	children: ReactNode;
	dehydratedState?: DehydratedState;
}

export function Providers({ children, dehydratedState }: ProvidersProps) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
			<ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
		</QueryClientProvider>
	);
}
