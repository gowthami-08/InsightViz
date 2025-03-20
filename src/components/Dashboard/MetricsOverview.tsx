import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from "@/components/ui/card";
import { 
  BarChart, 
  AreaChart, 
  PieChart, 
  LineChart as RechartsLineChart, 
  Line,
  Area, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell, 
  Pie 
} from 'recharts';

interface DashboardData {
  totalItems: number;
  averageIntensity: number;
  averageLikelihood: number;
  averageRelevance: number;
  intensityBySector: { sector: string; value: number }[];
  likelihoodByRegion: { region: string; value: number }[];
  relevanceByTopic: { topic: string; value: number }[];
  dataByYear: { year: number; count: number }[];
  topInsights: { title: string; intensity: number; sector: string; topic: string }[];
  sectorDistribution: { name: string; value: number }[];
  pestleDistribution: { name: string; value: number }[];
  regionDistribution: { name: string; value: number }[];
}

interface MetricsOverviewProps {
  dashboardData: DashboardData | null;
  filteredDataCount: number;
}

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#2563eb', '#1d4ed8'];

export const MetricsOverview = ({ dashboardData, filteredDataCount }: MetricsOverviewProps) => {
  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-40">
        <p>No data available with current filters. Try adjusting your filters.</p>
      </div>
    );
  }

  const truncateText = (text: string, maxLength: number = 15) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-8">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-medium transition-all animate-fade-in">
          <CardHeader className="pb-2">
            <CardDescription>Total Data Points</CardDescription>
            <CardTitle className="text-3xl font-bold">{filteredDataCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {filteredDataCount === dashboardData.totalItems 
                ? 'All data points' 
                : `${((filteredDataCount / dashboardData.totalItems) * 100).toFixed(1)}% of total`}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-medium transition-all animate-fade-in [animation-delay:100ms]">
          <CardHeader className="pb-2">
            <CardDescription>Average Intensity</CardDescription>
            <CardTitle className="text-3xl font-bold">{dashboardData.averageIntensity.toFixed(1)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">Scale: 1-10</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-medium transition-all animate-fade-in [animation-delay:200ms]">
          <CardHeader className="pb-2">
            <CardDescription>Average Likelihood</CardDescription>
            <CardTitle className="text-3xl font-bold">{dashboardData.averageLikelihood.toFixed(1)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">Scale: 1-5</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-medium transition-all animate-fade-in [animation-delay:300ms]">
          <CardHeader className="pb-2">
            <CardDescription>Average Relevance</CardDescription>
            <CardTitle className="text-3xl font-bold">{dashboardData.averageRelevance.toFixed(1)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">Scale: 1-5</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intensity by Sector */}
        <Card className="hover:shadow-medium transition-all">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Intensity by Sector</CardTitle>
            <CardDescription>Average intensity score for each sector</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData.intensityBySector.slice(0, 7)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                barSize={30}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="sector" 
                  tickFormatter={(value) => truncateText(value, 10)}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px', 
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                  }}
                  formatter={(value, name) => [value, 'Intensity']}
                  labelFormatter={(label) => `Sector: ${label}`}
                />
                <Bar 
                  dataKey="value" 
                  name="Intensity" 
                  radius={[4, 4, 0, 0]}
                  className="animate-slide-up [animation-delay:400ms]"
                >
                  {dashboardData.intensityBySector.slice(0, 7).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Likelihood by Region */}
        <Card className="hover:shadow-medium transition-all">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Likelihood by Region</CardTitle>
            <CardDescription>Average likelihood score for each region</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData.likelihoodByRegion.slice(0, 7)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 12 }} domain={[0, 5]} />
                <YAxis 
                  dataKey="region" 
                  type="category" 
                  tickFormatter={(value) => truncateText(value, 15)}
                  tick={{ fontSize: 12 }}
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px', 
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                  }}
                  formatter={(value, name) => [value, 'Likelihood']}
                  labelFormatter={(label) => `Region: ${label}`}
                />
                <Bar 
                  dataKey="value" 
                  name="Likelihood" 
                  radius={[0, 4, 4, 0]}
                  className="animate-slide-up [animation-delay:500ms]"
                >
                  {dashboardData.likelihoodByRegion.slice(0, 7).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Data by Year */}
        <Card className="hover:shadow-medium transition-all">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Timeline Distribution</CardTitle>
            <CardDescription>Data points by year</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dashboardData.dataByYear}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px', 
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                  }}
                  formatter={(value, name) => [value, 'Data Points']}
                  labelFormatter={(label) => `Year: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="Data Points"
                  stroke="#3b82f6" 
                  fill="#3b82f680"
                  strokeWidth={2}
                  className="animate-slide-up [animation-delay:600ms]"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Sector Distribution */}
        <Card className="hover:shadow-medium transition-all">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Sector Distribution</CardTitle>
            <CardDescription>Data points by sector</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.sectorDistribution.slice(0, 7)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  className="animate-fade-in [animation-delay:700ms]"
                >
                  {dashboardData.sectorDistribution.slice(0, 7).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px', 
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                  }}
                  formatter={(value, name, props) => [value, 'Data Points']}
                  labelFormatter={(label) => `Sector: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Relevance by Topic */}
        <Card className="hover:shadow-medium transition-all lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Relevance by Topic</CardTitle>
            <CardDescription>Average relevance score for each topic</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={dashboardData.relevanceByTopic.slice(0, 10)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="topic" 
                  tickFormatter={(value) => truncateText(value, 10)}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 5]} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px', 
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                  }}
                  formatter={(value, name) => [value, 'Relevance']}
                  labelFormatter={(label) => `Topic: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Relevance"
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2, fill: '#3b82f6' }}
                  className="animate-slide-up [animation-delay:800ms]"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Insights Table */}
      <Card className="hover:shadow-medium transition-all">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Top Insights by Intensity</CardTitle>
          <CardDescription>Insights with highest intensity scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left font-medium text-muted-foreground">Title</th>
                  <th className="pb-2 text-center font-medium text-muted-foreground">Intensity</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Sector</th>
                  <th className="pb-2 text-left font-medium text-muted-foreground">Topic</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.topInsights.map((insight, index) => (
                  <tr 
                    key={index} 
                    className="border-b last:border-b-0 hover:bg-secondary/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${800 + index * 100}ms` }}
                  >
                    <td className="py-3 pr-4">{insight.title}</td>
                    <td className="py-3 text-center">
                      <span className="inline-block px-2 py-1 font-medium text-xs rounded-full bg-primary/10 text-primary">
                        {insight.intensity}
                      </span>
                    </td>
                    <td className="py-3 px-4">{insight.sector}</td>
                    <td className="py-3">{insight.topic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
