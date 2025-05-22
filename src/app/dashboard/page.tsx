import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import {
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  MegaphoneIcon,
  NewspaperIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export default async function DashboardPage() {
  // Get counts for dashboard with error handling
  let companiesCount = 0;
  let branchesCount = 0;
  let newsCount = 0;
  let advertisementsCount = 0;
  let messagesCount = 0;
  let usersCount = 0;

  try {
    // Fetch all counts in parallel
    const [companies, branches, news, advertisements, messages, users] = await Promise.all([
      prisma.company.count(),
      prisma.branch.count(),
      prisma.news.count(),
      prisma.advertisement.count(),
      prisma.message.count(),
      prisma.user.count()
    ]);

    companiesCount = companies;
    branchesCount = branches;
    newsCount = news;
    advertisementsCount = advertisements;
    messagesCount = messages;
    usersCount = users;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Continue with default values (0)
  }

  return (
    <div className='w-60% m-auto'>
      <div className="mb-8 mx-3">
        <h1 className="text-2xl font-bold text-gray-900">مرحباً بك في لوحة التحكم</h1>
        <p className="mt-2 text-gray-600">هنا يمكنك إدارة محتوى الموقع والاطلاع على الإحصائيات</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-4">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2 bg-blue-50 rounded-t-lg border-b border-gray-200">
            <CardTitle className="text-sm font-medium text-blue-700">الشركات</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">{companiesCount}</div>
              <div className="ml-2 p-2 bg-blue-100 rounded-full">
                <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2 bg-green-50 rounded-t-lg border-b border-gray-200">
            <CardTitle className="text-sm font-medium text-green-700">الفروع</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">{branchesCount}</div>
              <div className="ml-2 p-2 bg-green-100 rounded-full">
                <BuildingStorefrontIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2 bg-purple-50 rounded-t-lg border-b border-gray-200">
            <CardTitle className="text-sm font-medium text-purple-700">الاخبار</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">{newsCount}</div>
              <div className="ml-2 p-2 bg-purple-100 rounded-full">
                <NewspaperIcon className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2 bg-yellow-50 rounded-t-lg border-b border-gray-200">
            <CardTitle className="text-sm font-medium text-yellow-700">الاعلانات</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">{advertisementsCount}</div>
              <div className="ml-2 p-2 bg-yellow-100 rounded-full">
                <MegaphoneIcon className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2 bg-red-50 rounded-t-lg border-b border-gray-200">
            <CardTitle className="text-sm font-medium text-red-700">الرسائل</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">{messagesCount}</div>
              <div className="ml-2 p-2 bg-red-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-red-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2 bg-indigo-50 rounded-t-lg border-b border-gray-200">
            <CardTitle className="text-sm font-medium text-indigo-700">المستخدمين</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">{usersCount}</div>
              <div className="ml-2 p-2 bg-indigo-100 rounded-full">
                <UserGroupIcon className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
