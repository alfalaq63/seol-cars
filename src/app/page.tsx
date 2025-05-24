import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import Link from "next/link";
import BnokForm from '@/components/BnokForm';
export default async function HomePage() {
  // Get companies for the home page with error handling
  let companies: any[] = [];
  try {
    companies = await prisma.company.findMany();
  } catch (error) {
    console.error('Error fetching companies:', error);
    // Return empty array if database is not available during build
    companies = [];
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            شركة سيول ليبيا للسيارات
          </h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto">
            الشريك الأمثل لخدمات السيارات في ليبيا
          </p>
        </div>
      </div>

      {/* Companies Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            شركاتنا
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            تعرف على شركاتنا المتخصصة في المجال المحدد لكل شركة
          </p>
        </div>

        <div className="mt-12 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {companies.length > 0 ? (
            companies.map((company) => (
              <Card key={company.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-36 w-full relative bg-white">
                  {company.logoUrl ? (
                    <div className="relative h-full w-full flex items-center justify-center p-2">
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="max-h-32 max-w-full object-contain"
                        onError={(e) => {
                          console.error('Error loading company logo:', company.logoUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">لا يوجد شعار</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{company.speciality}</p>
                  <Link href={`/companies/${company.id}`} className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-xs">
                    عرض التفاصيل &larr;
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">لا توجد شركات حالياً</p>
            </div>
          )}
        </div>

        <div>
          <BnokForm />
        </div>
      </div>
    </div>
  );
}
