"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { updateAocDetails } from "./actions"
import { useRouter } from "next/navigation"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  workId: string | null
}

export default function WorkOrderModificationDialog({ open, onOpenChange, workId }: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any | null>(null)

  const [memoNo, setMemoNo] = useState("")
  const [memoDate, setMemoDate] = useState("")
  const [isDelivery, setIsDelivery] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState("")

  useEffect(() => {
    if (!open || !workId) return
    setLoading(true)
    setError(null)
    fetch(`/api/workorder-aoc?workId=${workId}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        const aoc = json.worksDetail?.AwardofContract
        const ao = Array.isArray(aoc) ? aoc[0] : aoc
        setMemoNo(ao?.workodermenonumber ?? "")
        setMemoDate(ao?.workordeermemodate ? new Date(ao.workordeermemodate).toISOString().slice(0, 10) : "")
        setIsDelivery(ao?.isdelivery ?? false)
        setDeliveryDate(ao?.deliveryDate ? new Date(ao.deliveryDate).toISOString().slice(0, 10) : "")
      })
      .catch(() => setError("Failed to load work order"))
      .finally(() => setLoading(false))
  }, [open, workId])

  const onSubmit = async () => {
    if (!workId) return
    try {
      const form = new FormData()
      form.append("workId", workId)
      form.append("workodermenonumber", memoNo)
      form.append("workordeermemodate", memoDate)
      form.append("isdelivery", String(isDelivery))
      if (deliveryDate) form.append("deliveryDate", deliveryDate)

      const res = await updateAocDetails(form)
      if (res?.error) {
        toast({ title: "Error", description: res.error, variant: "destructive" })
      } else {
        toast({ title: "Saved", description: "Work order updated" })
        router.refresh()
        onOpenChange(false)
      }
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to save", variant: "destructive" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-xl">
        <DialogHeader>
          <DialogTitle>Modify Work Order</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : data ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Memo Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Memo Number</Label>
                  <Input value={memoNo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMemoNo(e.target.value)} placeholder="Enter memo number" />
                </div>
                <div>
                  <Label>Memo Date</Label>
                  <Input type="date" value={memoDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMemoDate(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox checked={isDelivery} onCheckedChange={(v: any) => setIsDelivery(!!v)} id="isdelivery" />
                  <Label htmlFor="isdelivery">Delivered</Label>
                </div>
                <div>
                  <Label>Delivery Date</Label>
                  <Input type="date" value={deliveryDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeliveryDate(e.target.value)} disabled={!isDelivery} />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={onSubmit}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <div className="p-4">No data</div>
        )}
      </DialogContent>
    </Dialog>
  )
}

