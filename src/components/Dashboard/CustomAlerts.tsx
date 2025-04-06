
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { BellRing } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export const CustomAlerts = () => {
  const [metric, setMetric] = useState("intensity");
  const [threshold, setThreshold] = useState("5");
  const [condition, setCondition] = useState("above");
  const [emailNotification, setEmailNotification] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Alert Created",
        description: `You will be alerted when ${metric} is ${condition} ${threshold}`,
      });
    }, 1000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <BellRing className="h-4 w-4" />
          <span>Configure Alerts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Custom Alerts</DialogTitle>
          <DialogDescription>
            Get notified when metrics cross important thresholds
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="metric" className="text-right">
                Metric
              </Label>
              <Select 
                value={metric} 
                onValueChange={setMetric}
              >
                <SelectTrigger id="metric" className="col-span-3">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intensity">Intensity</SelectItem>
                  <SelectItem value="likelihood">Likelihood</SelectItem>
                  <SelectItem value="relevance">Relevance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condition" className="text-right">
                Condition
              </Label>
              <Select 
                value={condition} 
                onValueChange={setCondition}
              >
                <SelectTrigger id="condition" className="col-span-3">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Above</SelectItem>
                  <SelectItem value="below">Below</SelectItem>
                  <SelectItem value="equal">Equal to</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="threshold" className="text-right">
                Threshold
              </Label>
              <Input
                id="threshold"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="col-span-3"
                min="0"
                max="10"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email-notification" className="text-right">
                Email Alert
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="email-notification"
                  checked={emailNotification}
                  onCheckedChange={setEmailNotification}
                />
                <Label htmlFor="email-notification">
                  {emailNotification ? "Enabled" : "Disabled"}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Alert"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
