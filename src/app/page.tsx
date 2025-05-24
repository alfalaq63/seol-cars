'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import BnokForm from '@/components/BnokForm';
import {
  BuildingOfficeIcon,
  CogIcon,
  ShieldCheckIcon,
  TruckIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  NewspaperIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const [companies, setCompanies] = useState<Array<{
    id: string;
    name: string;
    speciality: string;
    address: string;
    logoUrl: string | null;
    latitude: number | null;
    longitude: number | null;
  }>>([]);

  const [recentNews, setRecentNews] = useState<Array<{
    id: string;
    title: string;
    content: string;
    mainImage: string | null;
    date: string;
  }>>([]);

  const [loading, setLoading] = useState(true);

  const services = [
    {
      icon: TruckIcon,
      title: "خدمات النقل",
      description: "نوفر خدمات نقل شاملة وموثوقة لجميع أنواع السيارات"
    },
    {
      icon: CogIcon,
      title: "الصيانة والإصلاح",
      description: "خدمات صيانة متخصصة بأحدث التقنيات والمعدات"
    },
    {
      icon: ShieldCheckIcon,
      title: "ضمان الجودة",
      description: "نضمن جودة عالية في جميع خدماتنا مع ضمان شامل"
    },
    {
      icon: BuildingOfficeIcon,
      title: "شبكة واسعة",
      description: "شبكة من الفروع والشركات التابعة في جميع أنحاء ليبيا"
    }
  ];

  const stats = [
    { number: "15+", label: "سنة من الخبرة" },
    { number: "50+", label: "شركة تابعة" },
    { number: "1000+", label: "عميل راضي" },
    { number: "24/7", label: "خدمة العملاء" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch companies
        const companiesResponse = await fetch('/api/companies');
        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json();
          setCompanies(companiesData.slice(0, 8)); // Limit to 8 companies
        }

        // Fetch recent news
        const newsResponse = await fetch('/api/news');
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          setRecentNews(newsData.slice(0, 3)); // Limit to 3 recent news
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              شركة سيول ليبيا للسيارات
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto leading-relaxed">
              الشريك الأمثل لخدمات السيارات في ليبيا - نقدم حلولاً متكاملة وخدمات عالية الجودة
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 font-semibold px-8 py-3">
                  تواصل معنا
                  <ArrowLeftIcon className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/news">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600 font-semibold px-8 py-3">
                  آخر الأخبار
                  <NewspaperIcon className="mr-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              خدماتنا
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              نقدم مجموعة شاملة من الخدمات المتخصصة في مجال السيارات
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <service.icon className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Companies Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              شركاتنا
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              تعرف على شركاتنا المتخصصة في المجال المحدد لكل شركة
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {companies.length > 0 ? (
              companies.map((company) => (
                <Card key={company.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-32 w-full relative bg-white">
                    {company.logoUrl ? (
                      <div className="relative h-full w-full flex items-center justify-center p-3">
                        <img
                          src={company.logoUrl}
                          alt={company.name}
                          className="max-h-28 max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">لا يوجد شعار</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{company.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{company.speciality}</p>
                    <Link href={`/companies/${company.id}`} className="inline-block text-teal-600 hover:text-teal-800 text-sm font-medium">
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

          {companies.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/companies">
                <Button variant="outline" size="lg" className="font-semibold">
                  عرض جميع الشركات
                  <ArrowLeftIcon className="mr-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent News Section */}
      {recentNews.length > 0 && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                آخر الأخبار
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                تابع آخر الأخبار والتحديثات من سيول ليبيا للسيارات
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recentNews.map((news) => (
                <Link href={`/news/${news.id}`} key={news.id}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 w-full relative">
                      {news.mainImage ? (
                        <img
                          src={news.mainImage}
                          alt={news.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <NewspaperIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <CalendarIcon className="h-4 w-4 ml-1" />
                        {new Date(news.date).toLocaleDateString('ar-EG')}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{news.title}</h3>
                      <p className="text-gray-600 line-clamp-3">
                        {news.content.substring(0, 120)}
                        {news.content.length > 120 ? '...' : ''}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/news">
                <Button variant="outline" size="lg" className="font-semibold">
                  عرض جميع الأخبار
                  <ArrowLeftIcon className="mr-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
                من نحن
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                شركة سيول ليبيا للسيارات هي إحدى الشركات الرائدة في مجال خدمات السيارات في ليبيا.
                نحن نقدم حلولاً متكاملة وخدمات عالية الجودة لعملائنا منذ أكثر من 15 عاماً.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                تضم شبكتنا أكثر من 50 شركة تابعة وفرع في جميع أنحاء ليبيا، مما يضمن تقديم خدماتنا
                بأعلى معايير الجودة والكفاءة في كل مكان.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-teal-600 hover:bg-teal-700 font-semibold">
                    تواصل معنا
                    <PhoneIcon className="mr-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/companies">
                  <Button variant="outline" size="lg" className="font-semibold">
                    تصفح شركاتنا
                    <BuildingOfficeIcon className="mr-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <TruckIcon className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">خدمات النقل</h4>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <CogIcon className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">الصيانة</h4>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <ShieldCheckIcon className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">ضمان الجودة</h4>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">شبكة واسعة</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banks Section */}
      <BnokForm />

      {/* Contact CTA Section */}
      <div className="bg-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            هل تحتاج إلى خدماتنا؟
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            تواصل معنا اليوم للحصول على استشارة مجانية وخدمات عالية الجودة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 font-semibold px-8 py-3">
                <PhoneIcon className="ml-2 h-5 w-5" />
                اتصل بنا
              </Button>
            </Link>
            <Link href="mailto:info@siol-libya.com">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600 font-semibold px-8 py-3">
                <EnvelopeIcon className="ml-2 h-5 w-5" />
                أرسل رسالة
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}