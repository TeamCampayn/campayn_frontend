import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { getApiUrl } from '../../lib/api';
import { Calendar, Mail, FileText, Check, Loader2 } from 'lucide-react';

interface ScheduleReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  brandId: string;
}

export const ScheduleReportDialog: React.FC<ScheduleReportDialogProps> = ({
  isOpen,
  onClose,
  brandId
}) => {
  const { toast } = useToast();
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [recipients, setRecipients] = useState('');
  const [reportType, setReportType] = useState<'pdf' | 'tabular'>('pdf');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && brandId) {
      fetchCurrentSchedule();
    }
  }, [isOpen, brandId]);

  const fetchCurrentSchedule = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl(`/api/brands/${brandId}/report-schedule`));
      const data = await res.json();
      
      if (data.success && data.schedule) {
        const schedule = data.schedule;
        setFrequency(schedule.frequency || 'weekly');
        setRecipients(Array.isArray(schedule.recipients) ? schedule.recipients.join(', ') : schedule.recipients || '');
        setReportType(schedule.report_type || 'pdf');
        setIsActive(schedule.is_active !== false);
      }
    } catch (error) {
      console.error('Error fetching report schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const emails = recipients
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (emails.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one recipient email address.',
        variant: 'destructive'
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      toast({
        title: 'Invalid Email',
        description: `Invalid email address: ${invalidEmails[0]}`,
        variant: 'destructive'
      });
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(getApiUrl(`/api/brands/${brandId}/report-schedule`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          frequency,
          recipients: emails,
          report_type: reportType,
          is_active: isActive
        })
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Schedule Updated',
          description: 'Automated report schedule saved successfully.'
        });
        onClose();
      } else {
        throw new Error(data.error || 'Failed to save schedule');
      }
    } catch (error: any) {
      console.error('Error saving schedule:', error);
      toast({
        title: 'Error Saving Schedule',
        description: error.message || 'An error occurred while updating the report schedule.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-sm font-bold font-space uppercase tracking-wider text-neutral-800 flex items-center gap-2">
            <Calendar className="h-4.5 w-4.5 text-black" />
            Schedule Automated Reports
          </DialogTitle>
          <DialogDescription className="text-[10px] font-space uppercase tracking-wider text-zinc-400">
            Configure periodic analytics reports delivered directly to your inbox.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-black" />
          </div>
        ) : (
          <div className="space-y-5 py-4">
            {/* Frequency Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500">Frequency</label>
              <div className="grid grid-cols-3 gap-2">
                {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`py-2 px-3 rounded-xl border text-[10px] font-bold font-space uppercase tracking-wider transition-all ${
                      frequency === freq
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-zinc-650 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* Report Type Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500">Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setReportType('pdf')}
                  className={`py-2 px-3 rounded-xl border text-[10px] font-bold font-space uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    reportType === 'pdf'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-zinc-650 border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  PDF Brief
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('tabular')}
                  className={`py-2 px-3 rounded-xl border text-[10px] font-bold font-space uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    reportType === 'tabular'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-zinc-650 border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Tabular Sheet
                </button>
              </div>
            </div>

            {/* Recipients Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-zinc-400" />
                Recipients (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="e.g. founder@brand.com, marketing@brand.com"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                className="w-full text-xs font-space border border-zinc-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-black placeholder-zinc-300"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
              <div>
                <p className="text-[10px] font-bold font-space uppercase tracking-wider text-neutral-800">Status</p>
                <p className="text-[9px] font-space text-zinc-450 uppercase tracking-wider mt-0.5">Enable or disable automated delivery</p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-12 h-6.5 rounded-full p-1 transition-all ${
                  isActive ? 'bg-black flex justify-end' : 'bg-zinc-200 flex justify-start'
                }`}
              >
                <div className="w-4.5 h-4.5 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>
        )}

        <DialogFooter className="border-t border-zinc-150 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary-pill text-xs py-2 px-4 h-9"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary-pill text-xs py-2 px-4 h-9 flex items-center gap-1.5"
            disabled={saving || loading}
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                Save Schedule
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
