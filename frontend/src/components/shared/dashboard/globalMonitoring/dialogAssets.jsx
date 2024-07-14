import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import BorrowAssets from '@/components/shared/dashboard/globalMonitoring/borrow/balance';
import { LendingAssets } from '@/components/shared/dashboard/globalMonitoring/lending/balance';
export function DialogAssets({ actionContent }) {
  const switchContentWithContext = () => {
    switch (actionContent) {
      case 'Borrow':
        return <BorrowAssets />;
      case 'Lending':
        return <LendingAssets />
      default:
        return "Please select an action on main dashboard";
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border border-gray-300 rounded px-4 py-2"
        >
          {' '}
          Global monitoring
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle> {actionContent === "Borrow" ? "Assets to borrow" : "Assets to supply"}</DialogTitle>
          <DialogDescription>Global views</DialogDescription>
        </DialogHeader>
        <div className="grid">
         {switchContentWithContext()}
        </div>
        <DialogFooter asChild>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
