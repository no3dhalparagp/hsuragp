"use client";

import { useState, useActionState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createLinkageApplication } from "@/action/linkage-actions";

type FormState = {
  success?: boolean;
  message?: string;
  error?: string;
};

export default function LinkageApplicationPage() {
  const [form, setForm] = useState({
    applicationNo: "",
    applicantName: "",
    applicantPhone: "",
    applicantEmail: "",
    applicantAddress: "",
    linkageType: "",
    linkedEntityName: "",
    linkedEntityAddress: "",
  });
  const [beneficiaries, setBeneficiaries] = useState<
    { id: string; name: string; relation: string; parentId?: string }[]
  >([]);
  const [currentBeneficiary, setCurrentBeneficiary] = useState<{
    name: string;
    relation: string;
  }>({ name: "", relation: "" });
  const [selectedParent, setSelectedParent] = useState<string | undefined>(
    undefined,
  );

  const organizeIntoTree = (
    items: { id: string; name: string; relation: string; parentId?: string }[],
  ) => {
    const map = new Map<string, any>();
    const roots: any[] = [];
    for (const m of items) {
      map.set(m.id, { name: m.name, relation: m.relation, children: [] });
    }
    for (const m of items) {
      const current = map.get(m.id);
      if (m.parentId) {
        const parent = map.get(m.parentId);
        if (parent) parent.children.push(current);
      } else {
        roots.push(current);
      }
    }
    return roots;
  };

  const [state, submitAction, pending] = useActionState(
    async (_prev: FormState, fd: typeof form) => {
      const res = await createLinkageApplication({
        ...fd,
        documents: [],
        beneficiariesTree: organizeIntoTree(beneficiaries),
      });
      return { success: res.success, message: res.message, error: res.error };
    },
    { success: false, message: undefined, error: undefined },
  );

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Linkage Certificate Application</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="applicationNo">Application No</Label>
              <Input
                id="applicationNo"
                value={form.applicationNo}
                onChange={(e) =>
                  setForm((v) => ({ ...v, applicationNo: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="applicantName">Applicant Name</Label>
              <Input
                id="applicantName"
                value={form.applicantName}
                onChange={(e) =>
                  setForm((v) => ({ ...v, applicantName: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="applicantPhone">Applicant Phone</Label>
              <Input
                id="applicantPhone"
                value={form.applicantPhone}
                onChange={(e) =>
                  setForm((v) => ({ ...v, applicantPhone: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="applicantEmail">Applicant Email</Label>
              <Input
                id="applicantEmail"
                value={form.applicantEmail}
                onChange={(e) =>
                  setForm((v) => ({ ...v, applicantEmail: e.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="applicantAddress">Applicant Address</Label>
              <Input
                id="applicantAddress"
                value={form.applicantAddress}
                onChange={(e) =>
                  setForm((v) => ({ ...v, applicantAddress: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="linkageType">Linkage Type</Label>
              <Input
                id="linkageType"
                value={form.linkageType}
                onChange={(e) =>
                  setForm((v) => ({ ...v, linkageType: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="linkedEntityName">Linked Entity Name</Label>
              <Input
                id="linkedEntityName"
                value={form.linkedEntityName}
                onChange={(e) =>
                  setForm((v) => ({ ...v, linkedEntityName: e.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="linkedEntityAddress">Linked Entity Address</Label>
              <Input
                id="linkedEntityAddress"
                value={form.linkedEntityAddress}
                onChange={(e) =>
                  setForm((v) => ({
                    ...v,
                    linkedEntityAddress: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>Beneficiaries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="bname">Name</Label>
                    <Input
                      id="bname"
                      value={currentBeneficiary.name}
                      onChange={(e) =>
                        setCurrentBeneficiary((p) => ({
                          ...p,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="brelation">Relation</Label>
                    <Input
                      id="brelation"
                      value={currentBeneficiary.relation}
                      onChange={(e) =>
                        setCurrentBeneficiary((p) => ({
                          ...p,
                          relation: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Select Parent (optional)</Label>
                    <div className="border rounded p-2 max-h-40 overflow-auto">
                      {beneficiaries.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          No beneficiaries added yet
                        </div>
                      ) : (
                        beneficiaries.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            className={`w-full text-left p-2 rounded ${selectedParent === b.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"}`}
                            onClick={() =>
                              setSelectedParent(
                                selectedParent === b.id ? undefined : b.id,
                              )
                            }
                          >
                            <div className="font-medium">{b.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {b.relation}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (
                        !currentBeneficiary.name ||
                        !currentBeneficiary.relation
                      )
                        return;
                      const id = Date.now().toString();
                      setBeneficiaries((prev) => [
                        ...prev,
                        {
                          id,
                          name: currentBeneficiary.name,
                          relation: currentBeneficiary.relation,
                          parentId: selectedParent,
                        },
                      ]);
                      setCurrentBeneficiary({ name: "", relation: "" });
                      setSelectedParent(undefined);
                    }}
                  >
                    Add Beneficiary
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setBeneficiaries([])}
                  >
                    Clear
                  </Button>
                </div>
                {beneficiaries.length > 0 && (
                  <div className="space-y-2">
                    {beneficiaries.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between border rounded p-2"
                      >
                        <div>
                          <div className="font-medium">{b.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {b.relation}
                            {b.parentId
                              ? ` • Child of ${beneficiaries.find((x) => x.id === b.parentId)?.name || "selected"}`
                              : ""}
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            setBeneficiaries((prev) =>
                              prev.filter((x) => x.id !== b.id),
                            )
                          }
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={pending}
              onClick={() => submitAction(form)}
              className="w-full md:w-auto"
            >
              {pending ? "Submitting..." : "Submit Application"}
            </Button>
            {state?.error && (
              <span className="text-red-600">{state.error}</span>
            )}
            {state?.success && state?.message && (
              <span className="text-green-600">{state.message}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
