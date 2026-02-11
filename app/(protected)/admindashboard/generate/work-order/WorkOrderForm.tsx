"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Loader2, CheckCircle2, Printer } from "lucide-react";
import { generateFinancialYears, getCurrentFinancialYear } from "@/utils/financialYear";
import WorkorderCertificate from "@/components/PrintTemplet/Work-order-Certificate";
import SupplyOrder from "@/components/PrintTemplet/Supply-order";
import { AgrementCertificate } from "@/components/PrintTemplet/Agrement-certificate";
import CoverPagePrint from "@/components/PrintTemplet/CoverPage";
import Completationcertificate from "@/components/PrintTemplet/completation-certificate";
import PaymentCertificate from "@/components/PrintTemplet/payment-certificate";
import ScrutinySheet from "@/components/PrintTemplet/ScrutnisheetTemplete";
import ComparativeStatement from "@/components/PrintTemplet/comparative-statement";
import { Workorderdetails } from "@/types/tender-manage";
import { Agreement } from "@/types/agreement";
import { CompletationCertificate, PaymentDetilsType, workdetailsforprint } from "@/types";
import { workCoverPageType} from "@/types/worksdetails";
import { comparativeStatementProps } from "@/types";
import {
  getNitOptions,
  getWorkSlOptions,
  getWorkOrderDetails,
  type NitOption,
  type WorkSlOption,
} from "@/action/work-order-actions";

interface WorkOrderFormProps {
  initialFinancialYear?: string;
}

export default function WorkOrderForm({ initialFinancialYear }: WorkOrderFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [financialYear, setFinancialYear] = useState<string>(
    initialFinancialYear || searchParams.get("financialYear") || getCurrentFinancialYear()
  );
  const [nitNo, setNitNo] = useState<string>(searchParams.get("nitNo") || "");
  const [workSlNo, setWorkSlNo] = useState<string>(searchParams.get("workSlNo") || "");
  const [agencyName, setAgencyName] = useState<string>("");
  const [workOrderDetails, setWorkOrderDetails] = useState<Workorderdetails | null>(null);
  const [isSupply, setIsSupply] = useState<boolean>(false);
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [workDetailForCoverPage, setWorkDetailForCoverPage] = useState<workCoverPageType | null>(null);
  const [workDetailForCompletion, setWorkDetailForCompletion] = useState<CompletationCertificate | null>(null);
  const [workDetailForPayment, setWorkDetailForPayment] = useState<PaymentDetilsType | null>(null);
  const [workDetailForScrutiny, setWorkDetailForScrutiny] = useState<workdetailsforprint | null>(null);
  const [workDetailForComparative, setWorkDetailForComparative] = useState<comparativeStatementProps | null>(null);

  const [nitOptions, setNitOptions] = useState<NitOption[]>([]);
  const [workSlOptions, setWorkSlOptions] = useState<WorkSlOption[]>([]);
  const [loading, setLoading] = useState(false);

  const financialYears = generateFinancialYears();

  const fetchNitOptions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getNitOptions(financialYear);
      if (result.success) {
        setNitOptions(result.data);
      } else {
        console.error("Error fetching NIT options:", result.error);
        setNitOptions([]);
      }
    } catch (error) {
      console.error("Error fetching NIT options:", error);
      setNitOptions([]);
    } finally {
      setLoading(false);
    }
  }, [financialYear]);

  const fetchWorkSlOptions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getWorkSlOptions(financialYear, nitNo);
      if (result.success) {
        setWorkSlOptions(result.data);
      } else {
        console.error("Error fetching Work SL options:", result.error);
        setWorkSlOptions([]);
      }
    } catch (error) {
      console.error("Error fetching Work SL options:", error);
      setWorkSlOptions([]);
    } finally {
      setLoading(false);
    }
  }, [financialYear, nitNo]);

  const fetchWorkOrderDetails = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getWorkOrderDetails(financialYear, nitNo, workSlNo);
      if (result.success) {
        setAgencyName(result.data.agencyName);
        setWorkOrderDetails(result.data.workOrderDetails);
        setIsSupply(result.data.isSupply);
        setAgreement(result.data.agreement);
        setWorkDetailForCoverPage(result.data.workDetailForCoverPage);
        setWorkDetailForCompletion(result.data.workDetailForCompletion);
        setWorkDetailForPayment(result.data.workDetailForPayment);
        setWorkDetailForScrutiny(result.data.workDetailForScrutiny);
        setWorkDetailForComparative(result.data.workDetailForComparative);
      } else {
        console.error("Error fetching work order details:", result.error);
        setAgencyName("");
        setWorkOrderDetails(null);
        setIsSupply(false);
        setAgreement(null);
        setWorkDetailForCoverPage(null);
        setWorkDetailForCompletion(null);
        setWorkDetailForPayment(null);
        setWorkDetailForScrutiny(null);
        setWorkDetailForComparative(null);
      }
    } catch (error) {
      console.error("Error fetching work order details:", error);
      setAgencyName("");
      setWorkOrderDetails(null);
      setIsSupply(false);
      setAgreement(null);
      setWorkDetailForCoverPage(null);
      setWorkDetailForCompletion(null);
      setWorkDetailForPayment(null);
      setWorkDetailForScrutiny(null);
      setWorkDetailForComparative(null);
    } finally {
      setLoading(false);
    }
  }, [financialYear, nitNo, workSlNo]);

  // Initialize step and load data based on URL params on mount
  useEffect(() => {
    const urlNitNo = searchParams.get("nitNo") || "";
    const urlWorkSlNo = searchParams.get("workSlNo") || "";
    const urlFinancialYear = searchParams.get("financialYear") || getCurrentFinancialYear();

    if (urlFinancialYear) {
      setFinancialYear(urlFinancialYear);
    }
    if (urlNitNo) {
      setNitNo(urlNitNo);
    }
    if (urlWorkSlNo) {
      setWorkSlNo(urlWorkSlNo);
    }

    if (urlWorkSlNo) {
      setStep(4);
    } else if (urlNitNo) {
      setStep(3);
    } else if (urlFinancialYear) {
      setStep(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch NIT options when financial year is selected
  useEffect(() => {
    if (financialYear && step >= 2) {
      fetchNitOptions();
    }
  }, [financialYear, step, fetchNitOptions]);

  // Fetch Work SL options when NIT is selected
  useEffect(() => {
    if (nitNo && step >= 3) {
      fetchWorkSlOptions();
    }
  }, [nitNo, step, fetchWorkSlOptions]);

  // Fetch agency name and work order details when work SL is selected
  useEffect(() => {
    if (workSlNo && step >= 4) {
      fetchWorkOrderDetails();
    }
  }, [workSlNo, step, fetchWorkOrderDetails]);

  const handleFinancialYearChange = (value: string) => {
    setFinancialYear(value);
    setNitNo("");
    setWorkSlNo("");
    setAgencyName("");
    setWorkOrderDetails(null);
    setNitOptions([]);
    setWorkSlOptions([]);
    setStep(2);
    const params = new URLSearchParams(searchParams.toString());
    params.set("financialYear", value);
    params.delete("nitNo");
    params.delete("workSlNo");
    router.push(`?${params.toString()}`);
  };

  const handleNitChange = (value: string) => {
    setNitNo(value);
    setWorkSlNo("");
    setAgencyName("");
    setWorkOrderDetails(null);
    setWorkSlOptions([]);
    setStep(3);
    const params = new URLSearchParams(searchParams.toString());
    params.set("nitNo", value);
    params.delete("workSlNo");
    router.push(`?${params.toString()}`);
  };

  const handleWorkSlChange = (value: string) => {
    setWorkSlNo(value);
    setStep(4);
    const params = new URLSearchParams(searchParams.toString());
    params.set("workSlNo", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Generate Work Order</h1>
            <p className="text-sm text-muted-foreground">
              Select financial year, NIT number, and work SL number to generate work order
            </p>
          </div>
        </div>

        <Card className="rounded-xl shadow-sm border">
          <CardHeader className="py-4 px-6 border-b">
            <CardTitle className="text-lg">Work Order Generation</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Step 1: Financial Year */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    step >= 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : "1"}
                </div>
                <Label htmlFor="financial-year" className="text-base font-semibold">
                  Select Financial Year
                </Label>
              </div>
              <Select value={financialYear} onValueChange={handleFinancialYearChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Financial Year" />
                </SelectTrigger>
                <SelectContent>
                  {financialYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Step 2: NIT No */}
            {step >= 2 && financialYear && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      step >= 2
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : "2"}
                  </div>
                  <Label htmlFor="nit-no" className="text-base font-semibold">
                    Select NIT Number
                  </Label>
                </div>
                {loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading NIT options...</span>
                  </div>
                ) : (
                  <Select value={nitNo} onValueChange={handleNitChange} disabled={loading}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select NIT Number" />
                    </SelectTrigger>
                    <SelectContent>
                      {nitOptions.length === 0 ? (
                        <SelectItem value="no-options" disabled>
                          No NITs found for this financial year
                        </SelectItem>
                      ) : (
                        nitOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* Step 3: Work SL No */}
            {step >= 3 && nitNo && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      step >= 3
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > 3 ? <CheckCircle2 className="w-5 h-5" /> : "3"}
                  </div>
                  <Label htmlFor="work-sl-no" className="text-base font-semibold">
                    Select Work SL Number
                  </Label>
                </div>
                {loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading work options...</span>
                  </div>
                ) : (
                  <Select value={workSlNo} onValueChange={handleWorkSlChange} disabled={loading}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Work SL Number" />
                    </SelectTrigger>
                    <SelectContent>
                      {workSlOptions.length === 0 ? (
                        <SelectItem value="no-options" disabled>
                          No works found for this NIT
                        </SelectItem>
                      ) : (
                        workSlOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* Step 4: Agency Name Display */}
            {step >= 4 && workSlNo && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-primary text-primary-foreground">
                    {step > 4 ? <CheckCircle2 className="w-5 h-5" /> : "4"}
                  </div>
                  <Label className="text-base font-semibold">Agency Name</Label>
                </div>
                {loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading agency details...</span>
                  </div>
                ) : (
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="font-medium text-lg text-primary">
                      {agencyName || "No agency found"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Print Options */}
            {step >= 4 && workOrderDetails && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-primary text-primary-foreground">
                    5
                  </div>
                  <Label className="text-base font-semibold">Print Options</Label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Work Order Print */}
                  <Card className="p-4">
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Printer className="w-6 h-6 text-primary" />
                      </div>
                      <Label className="font-semibold text-center">Work Order</Label>
                      <WorkorderCertificate workOrderDetails={workOrderDetails} />
                    </div>
                  </Card>

                  {/* Agreement Print */}
                  {agreement && (
                    <Card className="p-4">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Printer className="w-6 h-6 text-primary" />
                        </div>
                        <Label className="font-semibold text-center">Agreement</Label>
                        <AgrementCertificate agrement={agreement} />
                      </div>
                    </Card>
                  )}

                  {/* Cover Page */}
                  {workDetailForCoverPage && (
                    <Card className="p-4">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Printer className="w-6 h-6 text-primary" />
                        </div>
                        <Label className="font-semibold text-center">Cover Page</Label>
                        <CoverPagePrint workCoverPageType={workDetailForCoverPage} />
                      </div>
                    </Card>
                  )}

                  {/* Completion Certificate */}
                  {workDetailForCompletion && (
                    <Card className="p-4">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Printer className="w-6 h-6 text-primary" />
                        </div>
                        <Label className="font-semibold text-center">Completion Certificate</Label>
                        <Completationcertificate paymentdetails={workDetailForCompletion} />
                      </div>
                    </Card>
                  )}

                  {/* Payment Certificate */}
                  {workDetailForPayment && (
                    <Card className="p-4">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Printer className="w-6 h-6 text-primary" />
                        </div>
                        <Label className="font-semibold text-center">Payment Certificate</Label>
                        <PaymentCertificate paymentdetails={workDetailForPayment} />
                      </div>
                    </Card>
                  )}

                  {/* Scrutiny Sheet */}
                  {workDetailForScrutiny && (
                    <Card className="p-4">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Printer className="w-6 h-6 text-primary" />
                        </div>
                        <Label className="font-semibold text-center">Scrutiny Sheet</Label>
                        <ScrutinySheet workdetails={workDetailForScrutiny} />
                      </div>
                    </Card>
                  )}

                  {/* Comparative Statement */}
                  {workDetailForComparative && (
                    <Card className="p-4">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Printer className="w-6 h-6 text-primary" />
                        </div>
                        <Label className="font-semibold text-center">Comparative Statement</Label>
                        <ComparativeStatement comparativeStatement={workDetailForComparative} />
                      </div>
                    </Card>
                  )}

                  {/* Supply Order (only if isSupply is true) */}
                  {isSupply && workOrderDetails && (
                    <Card className="p-4">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Printer className="w-6 h-6 text-primary" />
                        </div>
                        <Label className="font-semibold text-center">Supply Order</Label>
                        <SupplyOrder workOrderDetails={workOrderDetails} />
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

