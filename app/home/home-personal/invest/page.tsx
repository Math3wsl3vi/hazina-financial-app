"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InvestmentsPage from "@/components/invest/InvestPage";
import SnapshotCard from "@/components/invest/Snapshot";

export default function InvestmentPage() {
  return (
    <div className="container mx-auto py-8 px-4 font-poppins">
      <h1 className="text-3xl font-bold text-center mb-8">
        Investment Options
      </h1>

      <Tabs defaultValue="local" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="local">Local Investments</TabsTrigger>
          <TabsTrigger value="global">Global Investments</TabsTrigger>
        </TabsList>

        {/* Local Investments Tab */}
        <TabsContent value="local">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Low Risk Card */}
            <Card className="bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-600">
                  Low Risk (1-3%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Money market funds
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Treasury bill
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Treasury bonds
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Commercial papers
                  </li>
                </ul>
                <Button className="mt-4 w-full">Explore Low Risk</Button>
              </CardContent>
            </Card>

            {/* Medium Risk Card */}
            <Card className="bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-600">
                  Medium Risk (4-7%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Fixed Income Funds
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Balanced Fund
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Corporate bonds
                  </li>
                </ul>
                <Button className="mt-4 w-full">Explore Medium Risk</Button>
              </CardContent>
            </Card>

            {/* High Risk Card */}
            <Card className="bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-600">
                  High Risk (8-15%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Equities
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Sector-specific Funds
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Growth-oriented Unit Funds
                  </li>
                </ul>
                <Button className="mt-4 w-full">Explore High Risk</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Global Investments Tab */}
        <TabsContent value="global">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* HAZING POND Card */}
            <Card className="bg-green-50">
              <CardHeader>
                <CardTitle>Low risk investments</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Money market fund(EUR/USD)
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> US Treasury Bills
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> German bunds
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> High-Grade Corporate Bonds
                  </li>
                </ul>
                <Button className="mt-4 w-full">Learn More</Button>
              </CardContent>
            </Card>

            {/* Industrial Investment Card */}
            <Card className="bg-yellow-50">
              <CardHeader>
                <CardTitle>Medium risk investments</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Diversified Bond ETFs
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Real Estate ETFs
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Index funds
                  </li>
                </ul>
                <Button className="mt-4 w-full">Learn More</Button>
              </CardContent>
            </Card>

            {/* SCOP II Card */}
            <Card className="bg-red-50">
              <CardHeader>
                <CardTitle>High risk investments</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Emerging market ETFs
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Crypto currency
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Tech-focused ETFs
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Single stock investing
                  </li>
                </ul>
                <Button className="mt-4 w-full">Learn More</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Portfolio Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Your Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SnapshotCard
            indexName="NI225"
            indexLabel="Japan 225 Index"
            price="36,045.16"
            changePercent={0.57}
          />

          <Card>
            <CardHeader>
              <CardTitle>Your Watchlist</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Track your favorite investment options</p>
              <Button className="mt-4 w-full">View Watchlist</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <InvestmentsPage />
      <div className=""></div>
    </div>
  );
}
