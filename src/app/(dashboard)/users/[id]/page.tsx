"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfileCard } from "@/features/users/components/user-profile-card";
import { AppointmentsTab } from "@/features/users/components/tabs/appointments-tab";
import { CheckinsTab } from "@/features/users/components/tabs/checkins-tab";
import { SymptomsTab } from "@/features/users/components/tabs/symptoms-tab";
import { FlaresTab } from "@/features/users/components/tabs/flares-tab";
import { fetchUserDetail } from "@/features/users/api";
import type { UserDetail } from "@/features/users/types";
import { ChannelsTab } from "@/features/users/components/tabs/channels-tab";

const TABS = [
    { value: "appointments", label: "Appointments", count: "appointments" },
    { value: "checkins", label: "Check-ins", count: "checkins" },
    { value: "symptoms", label: "Symptoms", count: "symptoms" },
    { value: "flares", label: "Flares", count: "flares" },
    { value: "channels", label: "Channels", count: "channels" },
] as const;

const READY_TABS: string[] = ["appointments", "checkins", "symptoms", "flares", "channels"];

export default function UserDetailPage() {
    const { id } = useParams<{ id: string }>();

    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let ignore = false;

        (async () => {
            try {
                const data = await fetchUserDetail(id);
                if (!ignore) setUser(data);
            } catch {
                if (!ignore) setError(true);
            } finally {
                if (!ignore) setLoading(false);
            }
        })();

        return () => {
            ignore = true;
        };
    }, [id]);

    return (
        <div className="space-y-6">
            <Link
                href="/users"
                className="inline-flex items-center gap-1.5 text-sm text-[#6B6760] transition-colors hover:text-[#2F5D56]"
            >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                Users
            </Link>

            {loading && (
                <div className="space-y-6">
                    <Skeleton className="h-32 w-full rounded-lg bg-[#EFEBE2]" />
                    <Skeleton className="h-10 w-full bg-[#EFEBE2]" />
                    <Skeleton className="h-64 w-full rounded-lg bg-[#EFEBE2]" />
                </div>
            )}

            {!loading && (error || !user) && (
                <div className="rounded-lg border border-dashed border-[#D8D3C9] bg-[#FBFAF7] px-6 py-14 text-center">
                    <p className="text-sm font-medium text-[#1C1E1C]">User not found</p>
                    <p className="mt-1 text-sm text-[#9A958A]">
                        This user may have been removed, or the link is incorrect.
                    </p>
                </div>
            )}

            {!loading && user && (
                <>
                    <UserProfileCard
                        user={user}
                        onStatusChange={(status) =>
                            setUser((prev) => (prev ? { ...prev, status } : prev))
                        }
                    />

                    <Tabs defaultValue="appointments" className="gap-0">
                        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-[#E8E4DA] bg-transparent p-0">
                            {TABS.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="h-auto flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-4 py-3 text-sm font-medium text-[#7A756A] shadow-none transition-colors hover:text-[#1C1E1C] data-[state=active]:border-[#2F5D56] data-[state=active]:bg-transparent data-[state=active]:text-[#1C1E1C] data-[state=active]:shadow-none data-active:border-[#2F5D56] data-active:bg-transparent data-active:text-[#1C1E1C] data-active:shadow-none"
                                >
                                    {tab.label}
                                    <span className="ml-2 rounded-full bg-[#EFEBE2] px-1.5 py-0.5 text-[11px] font-medium text-[#6B6760]">
                                        {user.counts[tab.count]}
                                    </span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="appointments" className="pt-6">
                            <AppointmentsTab userId={user.id} />
                        </TabsContent>

                        <TabsContent value="checkins" className="pt-6">
                            <CheckinsTab userId={user.id} />
                        </TabsContent>

                        <TabsContent value="symptoms" className="pt-6">
                            <SymptomsTab userId={user.id} />
                        </TabsContent>

                        <TabsContent value="flares" className="pt-6">
                            <FlaresTab userId={user.id} />
                        </TabsContent>

                        <TabsContent value="channels" className="pt-6">
                            <ChannelsTab userId={user.id} />
                        </TabsContent>

                        {TABS.filter((tab) => !READY_TABS.includes(tab.value)).map((tab) => (
                            <TabsContent key={tab.value} value={tab.value} className="pt-6">
                                <div className="rounded-lg border border-dashed border-[#D8D3C9] bg-[#FBFAF7] px-6 py-14 text-center text-sm text-[#9A958A]">
                                    {tab.label} content goes here
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </>
            )}
        </div>
    );
}