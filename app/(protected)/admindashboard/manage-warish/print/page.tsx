import React from 'react'
import { db } from '@/lib/db'
import WarishPrintListClient from '@/components/WarishPrintListClient'

export default async function Page() {
  const docs = await db.warishDocument.findMany({
    where: { documentType: 'WarishCertificate' },
    include: { warish: true },
    orderBy: { createdAt: 'desc' },
  })

  const items = docs.map((d) => ({
    id: d.id,
    applicantName: d.warish.applicantName,
    nameOfDeceased: d.warish.nameOfDeceased,
    warishRefNo: d.warish.warishRefNo,
    warishRefDate: d.warish.warishRefDate,
    documentUrl: d.cloudinaryUrl,
  }))

  return <WarishPrintListClient items={items} />
}
