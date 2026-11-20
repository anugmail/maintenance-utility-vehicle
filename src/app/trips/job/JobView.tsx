"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { isVendorSt, stepOf } from "@/lib/mock/jobs";
import { jobHref, useTripCar } from "../_lib/ui";
import { CannotView } from "./CannotView";
import { JobPage } from "./JobPage";
import { VendorJob } from "./VendorJob";
import { WorkDetail } from "./WorkDetail";

export function JobView() {
  const { trip, car, job, actor, kbk, vendor } = useTripCar();
  const router = useRouter();
  const to = trip && car && job && actor && job.status === "doing" ? jobHref(trip, car.id, stepOf(job) === 1 ? "receive/" : "close/") : null;
  useEffect(() => { if (to) router.replace(to); }, [to, router]);
  if (!trip || !car || !job) return <EmptyStateSearchNotFound />;
  if (to) return null;
  if (isVendorSt(job.status)) return <VendorJob trip={trip} car={car} job={job} vendor={vendor} kbk={kbk} />;
  switch (job.status) {
    case "done":
      return <WorkDetail trip={trip} car={car} job={job} kbk={kbk} />;
    case "cannot":
      return <CannotView trip={trip} car={car} job={job} />;
    default:
      return <JobPage trip={trip} car={car} job={job} actor={actor} vendor={vendor} />;
  }
}
