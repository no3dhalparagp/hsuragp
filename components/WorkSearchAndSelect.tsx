'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Building2,
  Briefcase,
  Calculator,
  FileText,
  Scissors,
  Hash,
  MapPin,
  Tag,
} from 'lucide-react';

interface Work {
  id: string;
  workslno?: number;
  name?: string;
  location?: string;
  estimateNumber?: string;
  ApprovedActionPlanDetails?: {
    activityDescription: string;
    activityCode: string;
  };
  _count?: {
    workEstimateItems?: number;
    workMeasurementBooks?: number;
    workBillAbstracts?: number;
    workBillDeductions?: number;
  };
}

interface WorkSearchAndSelectProps {
  works: Work[];
  selectedWorkId: string | null;
  onSelect: (workId: string) => void;
  placeholder?: string;
  showCountBadges?: boolean;
}

export default function WorkSearchAndSelect({
  works,
  selectedWorkId,
  onSelect,
  placeholder = 'Search by work name, location, estimate, code, or serial no…',
  showCountBadges = false,
}: WorkSearchAndSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const getDisplayName = (work: Work) =>
    work.name ||
    work.ApprovedActionPlanDetails?.activityDescription ||
    `Work ${work.workslno ?? ''}`;

  const getWorkCode = (work: Work) =>
    work.estimateNumber ||
    work.ApprovedActionPlanDetails?.activityCode ||
    '';

  const getSearchableText = (work: Work) =>
    [
      getDisplayName(work),
      work.location,
      getWorkCode(work),
      work.workslno,
      work.ApprovedActionPlanDetails?.activityCode,
      work.ApprovedActionPlanDetails?.activityDescription,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

  const filteredWorks = useMemo(() => {
    if (!searchQuery.trim()) return works;
    const words = searchQuery.toLowerCase().split(/\s+/);
    return works.filter(work =>
      words.every(word => getSearchableText(work).includes(word))
    );
  }, [works, searchQuery]);

  const count = (w: Work, k: keyof NonNullable<Work['_count']>) =>
    w._count?.[k] || 0;

  return (
    <div className="bg-wb-bg p-4 rounded-2xl space-y-4">

      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-wb-primary" />
        <Input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="
            pl-10 h-11
            bg-white
            border border-wb-border
            rounded-lg
            focus-visible:ring-2
            focus-visible:ring-wb-primary
          "
        />
      </div>

      {searchQuery && (
        <p className="text-xs font-medium text-wb-primary">
          Showing {filteredWorks.length} of {works.length} works
        </p>
      )}

      {/* Work List */}
      <ScrollArea className="h-96 rounded-xl border border-wb-border bg-white">
        <div className="p-3 space-y-2">
          {filteredWorks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Building2 className="h-12 w-12 text-wb-border mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No works found
              </p>
              <p className="text-xs text-muted-foreground">
                Try different keywords
              </p>
            </div>
          ) : (
            filteredWorks.map(work => {
              const isSelected = selectedWorkId === work.id;
              const code = getWorkCode(work);

              return (
                <Button
                  key={work.id}
                  variant="ghost"
                  onClick={() => onSelect(work.id)}
                  className={`
                    w-full h-auto px-4 py-3
                    rounded-lg border text-left
                    transition-all
                    ${
                      isSelected
                        ? 'border-wb-primary bg-wb-primary/5 ring-2 ring-wb-primary/20'
                        : 'border-wb-border hover:bg-slate-50'
                    }
                  `}
                >
                  <div className="flex flex-col gap-2 w-full">

                    {/* Title Row */}
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm font-semibold leading-snug">
                        {getDisplayName(work)}
                      </p>
                      {work.workslno && (
                        <span className="
                          text-[11px]
                          font-semibold
                          text-wb-primary
                          border border-wb-primary/30
                          px-2 py-0.5
                          rounded-full
                        ">
                          SL {work.workslno}
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-xs text-wb-blue">
                      {work.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {work.location}
                        </span>
                      )}
                      {code && (
                        <span className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          {code}
                        </span>
                      )}
                    </div>

                    {/* Badges */}
                    {showCountBadges && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {count(work, 'workEstimateItems') > 0 && (
                          <Badge className="bg-wb-blue/10 text-wb-blue border border-wb-blue/30 text-[10px]">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {count(work, 'workEstimateItems')}
                          </Badge>
                        )}
                        {count(work, 'workMeasurementBooks') > 0 && (
                          <Badge className="bg-wb-secondary/15 text-wb-secondary border border-wb-secondary/40 text-[10px]">
                            <Calculator className="h-3 w-3 mr-1" />
                            {count(work, 'workMeasurementBooks')}
                          </Badge>
                        )}
                        {count(work, 'workBillAbstracts') > 0 && (
                          <Badge className="bg-wb-success/15 text-wb-success border border-wb-success/40 text-[10px]">
                            <FileText className="h-3 w-3 mr-1" />
                            {count(work, 'workBillAbstracts')}
                          </Badge>
                        )}
                        {count(work, 'workBillDeductions') > 0 && (
                          <Badge className="bg-wb-primary/10 text-wb-primary border border-wb-primary/30 text-[10px]">
                            <Scissors className="h-3 w-3 mr-1" />
                            {count(work, 'workBillDeductions')}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </Button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
