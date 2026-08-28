import { PackageForm } from "@/components/admin/package-form";

export default function AdminNewPackagePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Add New Package</h1>
      <PackageForm mode="create" />
    </div>
  );
}
