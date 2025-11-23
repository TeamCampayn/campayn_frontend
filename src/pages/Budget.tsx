
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DollarSign, CreditCard, AlertCircle, Plus, Download, RefreshCw, Clock, CheckCircle, XCircle, Info, Zap } from "lucide-react";

const paymentsData = [
  {
    id: 1,
    creator: "Maya Rodriguez",
    amount: "$2,500",
    status: "Pending",
    dueDate: "2024-06-15",
    campaign: "Summer Fashion 2024",
    paymentMethod: "Bank Transfer",
    daysOverdue: 0
  },
  {
    id: 2,
    creator: "Joe Chen",
    amount: "$1,800",
    status: "Paid",
    dueDate: "2024-06-10",
    campaign: "Tech Product Launch",
    paymentMethod: "PayPal",
    daysOverdue: 0
  },
  {
    id: 3,
    creator: "Sara Williams",
    amount: "$3,200",
    status: "Failed",
    dueDate: "2024-06-12",
    campaign: "Fitness Challenge",
    paymentMethod: "Stripe",
    daysOverdue: 2
  },
  {
    id: 4,
    creator: "Alex Thompson",
    amount: "$4,100",
    status: "Processing",
    dueDate: "2024-06-16",
    campaign: "Food & Lifestyle",
    paymentMethod: "Bank Transfer",
    daysOverdue: 0
  }
];

const getStatusBadge = (status: string, daysOverdue: number = 0) => {
  const statusConfig = {
    Pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
    Paid: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
    Failed: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
    Processing: { bg: "bg-blue-100", text: "text-blue-800", icon: RefreshCw }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
  const Icon = config.icon;
  
  return (
    <div className="flex items-center space-x-2">
      <Badge className={`${config.bg} ${config.text} border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
      {daysOverdue > 0 && (
        <Badge variant="destructive" className="text-xs">
          {daysOverdue}d overdue
        </Badge>
      )}
    </div>
  );
};

const PaymentRow = ({ payment }: { payment: typeof paymentsData[0] }) => (
  <TableRow className="hover:bg-primary-25 group">
    <TableCell className="font-medium">
      <div>
        <div className="font-semibold text-slate-900">{payment.creator}</div>
        <div className="text-sm text-slate-500">{payment.paymentMethod}</div>
      </div>
    </TableCell>
    
    <TableCell>
      <div>
        <div className="font-medium">{payment.campaign}</div>
        <div className="text-sm text-slate-500">Campaign payment</div>
      </div>
    </TableCell>
    
    <TableCell>
      <div className="font-bold text-lg text-slate-900">{payment.amount}</div>
    </TableCell>
    
    <TableCell>
      <div className="text-sm">
        <div className={payment.daysOverdue > 0 ? "text-red-600 font-medium" : ""}>
          {payment.dueDate}
        </div>
        {payment.daysOverdue > 0 && (
          <div className="text-xs text-red-500">Overdue</div>
        )}
      </div>
    </TableCell>
    
    <TableCell>
      {getStatusBadge(payment.status, payment.daysOverdue)}
    </TableCell>
    
    <TableCell>
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {payment.status === "Pending" && (
          <Button variant="outline" size="sm" className="bg-primary-50 text-primary-700 hover:bg-primary-100 border-primary-200">
            Process
          </Button>
        )}
        {payment.status === "Failed" && (
          <Button variant="outline" size="sm" className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200">
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
        <Button variant="ghost" size="sm" className="hover:bg-primary-25">
          View Details
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

const BudgetAlerts = () => (
  <div className="space-y-3">
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
      <div className="flex items-center">
        <XCircle className="h-5 w-5 text-red-600 mr-3" />
        <div className="flex-1">
          <p className="text-sm text-red-800">
            <strong>Payment Failed:</strong> Sara Williams payment failed due to insufficient funds.
            <Button variant="link" className="p-0 h-auto text-red-900 underline ml-2">
              Retry payment
            </Button>
          </p>
        </div>
      </div>
    </div>
    
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
        <div className="flex-1">
          <p className="text-sm text-yellow-800">
            <strong>Budget Alert:</strong> Summer Fashion 2024 campaign has used 95% of allocated budget.
            <Button variant="link" className="p-0 h-auto text-yellow-900 underline ml-2">
              Add budget
            </Button>
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Budget = () => {
  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              Budget & Payments
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-5 w-5 text-slate-400 ml-2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage campaign budgets and creator payments</p>
                </TooltipContent>
              </Tooltip>
            </h1>
            <p className="text-slate-600 mt-1">Manage campaign budgets and creator payments</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              <AlertCircle className="h-3 w-3 mr-1" />
              2 Alerts
            </Badge>
            <Button variant="outline" className="bg-primary-50 text-primary-700 hover:bg-primary-100 border-primary-200">
              <RefreshCw className="h-4 w-4 mr-2" />
              Process Payments
            </Button>
            <Button className="bg-primary hover:bg-primary-600 shadow-card">
              <Plus className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </div>
        </div>

        {/* Alert Banners */}
        <BudgetAlerts />

        {/* Enhanced Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="clean-card hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Allocated
              </CardTitle>
              <div className="p-2 bg-primary-50 rounded-full">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">$210,000</div>
              <p className="text-xs text-slate-600 mt-1">Across all campaigns</p>
              <Badge variant="secondary" className="mt-2 text-xs bg-primary-50 text-primary-700">
                +$50K this quarter
              </Badge>
            </CardContent>
          </Card>

          <Card className="clean-card hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Spent to Date
              </CardTitle>
              <div className="p-2 bg-green-50 rounded-full">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">$142,000</div>
              <p className="text-xs text-slate-600 mt-1">68% of total budget</p>
              <Badge variant="secondary" className="mt-2 text-xs bg-green-50 text-green-700">
                On track
              </Badge>
            </CardContent>
          </Card>

          <Card className="clean-card hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Pending Payments
              </CardTitle>
              <div className="p-2 bg-yellow-50 rounded-full">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">$18,500</div>
              <p className="text-xs text-slate-600 mt-1">7 payments due</p>
              <Badge variant="destructive" className="mt-2 text-xs">
                1 overdue
              </Badge>
            </CardContent>
          </Card>

          <Card className="clean-card hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Remaining Budget
              </CardTitle>
              <div className="p-2 bg-primary-50 rounded-full">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">$68,000</div>
              <p className="text-xs text-slate-600 mt-1">32% remaining</p>
              <Badge variant="secondary" className="mt-2 text-xs bg-primary-50 text-primary-700">
                Available
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Payment Schedule */}
        <Card className="clean-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                Payment Schedule
                <Badge variant="outline" className="ml-3 bg-primary-50 text-primary-700 border-primary-200">
                  <Zap className="h-3 w-3 mr-1" />
                  Auto-sync enabled
                </Badge>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="hover:bg-primary-25">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="hover:bg-primary-25">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-primary-25">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700">Creator</TableHead>
                    <TableHead className="font-semibold text-slate-700">Campaign</TableHead>
                    <TableHead className="font-semibold text-slate-700">Amount</TableHead>
                    <TableHead className="font-semibold text-slate-700">Due Date</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentsData.map((payment) => (
                    <PaymentRow key={payment.id} payment={payment} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Payment Cards (Hidden on Desktop) */}
        <div className="lg:hidden space-y-4">
          {paymentsData.map((payment) => (
            <Card key={payment.id} className="clean-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{payment.creator}</h3>
                    <p className="text-sm text-slate-600">{payment.campaign}</p>
                    <p className="text-xs text-slate-500">{payment.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{payment.amount}</div>
                    {getStatusBadge(payment.status, payment.daysOverdue)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-600">Due: {payment.dueDate}</span>
                  {payment.daysOverdue > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {payment.daysOverdue}d overdue
                    </Badge>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {payment.status === "Pending" && (
                    <Button variant="outline" size="sm" className="flex-1 bg-primary-50 text-primary-700 border-primary-200">
                      Process
                    </Button>
                  )}
                  {payment.status === "Failed" && (
                    <Button variant="outline" size="sm" className="flex-1 bg-red-50 text-red-700 border-red-200">
                      Retry
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="flex-1 hover:bg-primary-25">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Budget;
