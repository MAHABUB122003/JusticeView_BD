const courts = [
  // Dhaka District
  { name: 'Dhaka District Judge Court', name_bn: 'ঢাকা জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Dhaka' },
  { name: 'Dhaka Chief Judicial Magistrate Court', name_bn: 'ঢাকা চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Dhaka' },
  { name: 'Dhaka Metropolitan Sessions Judge Court', name_bn: 'ঢাকা মেট্রোপলিটন সেশন জজ আদালত', courtType: 'Sessions Court', districtName: 'Dhaka' },
  { name: 'Dhaka Chief Metropolitan Magistrate Court', name_bn: 'ঢাকা চীফ মেট্রোপলিটন ম্যাজিস্ট্রেট আদালত', courtType: 'CMM Court', districtName: 'Dhaka' },
  // Gazipur
  { name: 'Gazipur District Judge Court', name_bn: 'গাজীপুর জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Gazipur' },
  { name: 'Gazipur Chief Judicial Magistrate Court', name_bn: 'গাজীপুর চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Gazipur' },
  // Narayanganj
  { name: 'Narayanganj District Judge Court', name_bn: 'নারায়ণগঞ্জ জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Narayanganj' },
  { name: 'Narayanganj Chief Judicial Magistrate Court', name_bn: 'নারায়ণগঞ্জ চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Narayanganj' },
  // Narsingdi
  { name: 'Narsingdi District Judge Court', name_bn: 'নরসিংদী জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Narsingdi' },
  { name: 'Narsingdi Chief Judicial Magistrate Court', name_bn: 'নরসিংদী চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Narsingdi' },
  // Manikganj
  { name: 'Manikganj District Judge Court', name_bn: 'মানিকগঞ্জ জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Manikganj' },
  { name: 'Manikganj Chief Judicial Magistrate Court', name_bn: 'মানিকগঞ্জ চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Manikganj' },
  // Munshiganj
  { name: 'Munshiganj District Judge Court', name_bn: 'মুন্সীগঞ্জ জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Munshiganj' },
  { name: 'Munshiganj Chief Judicial Magistrate Court', name_bn: 'মুন্সীগঞ্জ চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Munshiganj' },
  // Tangail
  { name: 'Tangail District Judge Court', name_bn: 'টাঙ্গাইল জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Tangail' },
  { name: 'Tangail Chief Judicial Magistrate Court', name_bn: 'টাঙ্গাইল চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Tangail' },
  // Faridpur
  { name: 'Faridpur District Judge Court', name_bn: 'ফরিদপুর জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Faridpur' },
  { name: 'Faridpur Chief Judicial Magistrate Court', name_bn: 'ফরিদপুর চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Faridpur' },
  // Rajbari
  { name: 'Rajbari District Judge Court', name_bn: 'রাজবাড়ী জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Rajbari' },
  { name: 'Rajbari Chief Judicial Magistrate Court', name_bn: 'রাজবাড়ী চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Rajbari' },
  // Gopalganj
  { name: 'Gopalganj District Judge Court', name_bn: 'গোপালগঞ্জ জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Gopalganj' },
  { name: 'Gopalganj Chief Judicial Magistrate Court', name_bn: 'গোপালগঞ্জ চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Gopalganj' },
  // Madaripur
  { name: 'Madaripur District Judge Court', name_bn: 'মাদারীপুর জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Madaripur' },
  { name: 'Madaripur Chief Judicial Magistrate Court', name_bn: 'মাদারীপুর চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Madaripur' },
  // Shariatpur
  { name: 'Shariatpur District Judge Court', name_bn: 'শরীয়তপুর জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Shariatpur' },
  { name: 'Shariatpur Chief Judicial Magistrate Court', name_bn: 'শরীয়তপুর চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Shariatpur' },
  // Kishoreganj
  { name: 'Kishoreganj District Judge Court', name_bn: 'কিশোরগঞ্জ জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Kishoreganj' },
  { name: 'Kishoreganj Chief Judicial Magistrate Court', name_bn: 'কিশোরগঞ্জ চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Kishoreganj' },
  // Chattogram District
  { name: 'Chattogram District Judge Court', name_bn: 'চট্টগ্রাম জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Chattogram' },
  { name: 'Chattogram Chief Judicial Magistrate Court', name_bn: 'চট্টগ্রাম চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Chattogram' },
  { name: 'Chattogram Metropolitan Sessions Judge Court', name_bn: 'চট্টগ্রাম মেট্রোপলিটন সেশন জজ আদালত', courtType: 'Sessions Court', districtName: 'Chattogram' },
  { name: 'Chattogram Chief Metropolitan Magistrate Court', name_bn: 'চট্টগ্রাম চীফ মেট্রোপলিটন ম্যাজিস্ট্রেট আদালত', courtType: 'CMM Court', districtName: 'Chattogram' },
  // Cox's Bazar
  { name: "Cox's Bazar District Judge Court", name_bn: 'কক্সবাজার জেলা জজ আদালত', courtType: 'District Judge Court', districtName: "Cox's Bazar" },
  { name: "Cox's Bazar Chief Judicial Magistrate Court", name_bn: 'কক্সবাজার চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: "Cox's Bazar" },
  // Bandarban
  { name: 'Bandarban District Judge Court', name_bn: 'বান্দরবান জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Bandarban' },
  { name: 'Bandarban Chief Judicial Magistrate Court', name_bn: 'বান্দরবান চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Bandarban' },
  // Rangamati
  { name: 'Rangamati District Judge Court', name_bn: 'রাঙ্গামাটি জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Rangamati' },
  { name: 'Rangamati Chief Judicial Magistrate Court', name_bn: 'রাঙ্গামাটি চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Rangamati' },
  // Khagrachari
  { name: 'Khagrachari District Judge Court', name_bn: 'খাগড়াছড়ি জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Khagrachari' },
  { name: 'Khagrachari Chief Judicial Magistrate Court', name_bn: 'খাগড়াছড়ি চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Khagrachari' },
  // Cumilla
  { name: 'Cumilla District Judge Court', name_bn: 'কুমিল্লা জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Cumilla' },
  { name: 'Cumilla Chief Judicial Magistrate Court', name_bn: 'কুমিল্লা চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Cumilla' },
  // Feni
  { name: 'Feni District Judge Court', name_bn: 'ফেনী জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Feni' },
  { name: 'Feni Chief Judicial Magistrate Court', name_bn: 'ফেনী চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Feni' },
  // Noakhali
  { name: 'Noakhali District Judge Court', name_bn: 'নোয়াখালী জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Noakhali' },
  { name: 'Noakhali Chief Judicial Magistrate Court', name_bn: 'নোয়াখালী চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Noakhali' },
  // Lakshmipur
  { name: 'Lakshmipur District Judge Court', name_bn: 'লক্ষ্মীপুর জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Lakshmipur' },
  { name: 'Lakshmipur Chief Judicial Magistrate Court', name_bn: 'লক্ষ্মীপুর চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Lakshmipur' },
  // Chandpur
  { name: 'Chandpur District Judge Court', name_bn: 'চাঁদপুর জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Chandpur' },
  { name: 'Chandpur Chief Judicial Magistrate Court', name_bn: 'চাঁদপুর চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Chandpur' },
  // Brahmanbaria
  { name: 'Brahmanbaria District Judge Court', name_bn: 'ব্রাহ্মণবাড়িয়া জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Brahmanbaria' },
  { name: 'Brahmanbaria Chief Judicial Magistrate Court', name_bn: 'ব্রাহ্মণবাড়িয়া চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Brahmanbaria' },
  // Rajshahi
  { name: 'Rajshahi District Judge Court', name_bn: 'রাজশাহী জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Rajshahi' },
  { name: 'Rajshahi Chief Judicial Magistrate Court', name_bn: 'রাজশাহী চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Rajshahi' },
  { name: 'Rajshahi Metropolitan Sessions Judge Court', name_bn: 'রাজশাহী মেট্রোপলিটন সেশন জজ আদালত', courtType: 'Sessions Court', districtName: 'Rajshahi' },
  { name: 'Rajshahi Chief Metropolitan Magistrate Court', name_bn: 'রাজশাহী চীফ মেট্রোপলিটন ম্যাজিস্ট্রেট আদালত', courtType: 'CMM Court', districtName: 'Rajshahi' },
  // Pabna
  { name: 'Pabna District Judge Court', name_bn: 'পাবনা জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Pabna' },
  { name: 'Pabna Chief Judicial Magistrate Court', name_bn: 'পাবনা চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Pabna' },
  // Natore
  { name: 'Natore District Judge Court', name_bn: 'নাটোর জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Natore' },
  { name: 'Natore Chief Judicial Magistrate Court', name_bn: 'নাটোর চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Natore' },
  // Sirajganj
  { name: 'Sirajganj District Judge Court', name_bn: 'সিরাজগঞ্জ জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Sirajganj' },
  { name: 'Sirajganj Chief Judicial Magistrate Court', name_bn: 'সিরাজগঞ্জ চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Sirajganj' },
  // Bogura
  { name: 'Bogura District Judge Court', name_bn: 'বগুড়া জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Bogura' },
  { name: 'Bogura Chief Judicial Magistrate Court', name_bn: 'বগুড়া চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Bogura' },
  // Joypurhat
  { name: 'Joypurhat District Judge Court', name_bn: 'জয়পুরহাট জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Joypurhat' },
  { name: 'Joypurhat Chief Judicial Magistrate Court', name_bn: 'জয়পুরহাট চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Joypurhat' },
  // Chapainawabganj
  { name: 'Chapainawabganj District Judge Court', name_bn: 'চাঁপাইনবাবগঞ্জ জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Chapainawabganj' },
  { name: 'Chapainawabganj Chief Judicial Magistrate Court', name_bn: 'চাঁপাইনবাবগঞ্জ চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Chapainawabganj' },
  // Naogaon
  { name: 'Naogaon District Judge Court', name_bn: 'নওগাঁ জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Naogaon' },
  { name: 'Naogaon Chief Judicial Magistrate Court', name_bn: 'নওগাঁ চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Naogaon' },
  // Khulna
  { name: 'Khulna District Judge Court', name_bn: 'খুলনা জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Khulna' },
  { name: 'Khulna Chief Judicial Magistrate Court', name_bn: 'খুলনা চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Khulna' },
  { name: 'Khulna Metropolitan Sessions Judge Court', name_bn: 'খুলনা মেট্রোপলিটন সেশন জজ আদালত', courtType: 'Sessions Court', districtName: 'Khulna' },
  { name: 'Khulna Chief Metropolitan Magistrate Court', name_bn: 'খুলনা চীফ মেট্রোপলিটন ম্যাজিস্ট্রেট আদালত', courtType: 'CMM Court', districtName: 'Khulna' },
  // Bagerhat
  { name: 'Bagerhat District Judge Court', name_bn: 'বাগেরহাট জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Bagerhat' },
  { name: 'Bagerhat Chief Judicial Magistrate Court', name_bn: 'বাগেরহাট চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Bagerhat' },
  // Satkhira
  { name: 'Satkhira District Judge Court', name_bn: 'সাতক্ষীরা জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Satkhira' },
  { name: 'Satkhira Chief Judicial Magistrate Court', name_bn: 'সাতক্ষীরা চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Satkhira' },
  // Jashore
  { name: 'Jashore District Judge Court', name_bn: 'যশোর জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Jashore' },
  { name: 'Jashore Chief Judicial Magistrate Court', name_bn: 'যশোর চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Jashore' },
  // Jhenaidah
  { name: 'Jhenaidah District Judge Court', name_bn: 'ঝিনাইদহ জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Jhenaidah' },
  { name: 'Jhenaidah Chief Judicial Magistrate Court', name_bn: 'ঝিনাইদহ চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Jhenaidah' },
  // Magura
  { name: 'Magura District Judge Court', name_bn: 'মাগুরা জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Magura' },
  { name: 'Magura Chief Judicial Magistrate Court', name_bn: 'মাগুরা চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Magura' },
  // Narail
  { name: 'Narail District Judge Court', name_bn: 'নড়াইল জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Narail' },
  { name: 'Narail Chief Judicial Magistrate Court', name_bn: 'নড়াইল চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Narail' },
  // Chuadanga
  { name: 'Chuadanga District Judge Court', name_bn: 'চুয়াডাঙ্গা জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Chuadanga' },
  { name: 'Chuadanga Chief Judicial Magistrate Court', name_bn: 'চুয়াডাঙ্গা চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Chuadanga' },
  // Kushtia
  { name: 'Kushtia District Judge Court', name_bn: 'কুষ্টিয়া জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Kushtia' },
  { name: 'Kushtia Chief Judicial Magistrate Court', name_bn: 'কুষ্টিয়া চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Kushtia' },
  // Meherpur
  { name: 'Meherpur District Judge Court', name_bn: 'মেহেরপুর জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Meherpur' },
  { name: 'Meherpur Chief Judicial Magistrate Court', name_bn: 'মেহেরপুর চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Meherpur' },
  // Barishal
  { name: 'Barishal District Judge Court', name_bn: 'বরিশাল জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Barishal' },
  { name: 'Barishal Chief Judicial Magistrate Court', name_bn: 'বরিশাল চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Barishal' },
  { name: 'Barishal Metropolitan Sessions Judge Court', name_bn: 'বরিশাল মেট্রোপলিটন সেশন জজ আদালত', courtType: 'Sessions Court', districtName: 'Barishal' },
  { name: 'Barishal Chief Metropolitan Magistrate Court', name_bn: 'বরিশাল চীফ মেট্রোপলিটন ম্যাজিস্ট্রেট আদালত', courtType: 'CMM Court', districtName: 'Barishal' },
  // Bhola
  { name: 'Bhola District Judge Court', name_bn: 'ভোলা জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Bhola' },
  { name: 'Bhola Chief Judicial Magistrate Court', name_bn: 'ভোলা চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Bhola' },
  // Patuakhali
  { name: 'Patuakhali District Judge Court', name_bn: 'পটুয়াখালী জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Patuakhali' },
  { name: 'Patuakhali Chief Judicial Magistrate Court', name_bn: 'পটুয়াখালী চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Patuakhali' },
  // Barguna
  { name: 'Barguna District Judge Court', name_bn: 'বরগুনা জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Barguna' },
  { name: 'Barguna Chief Judicial Magistrate Court', name_bn: 'বরগুনা চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Barguna' },
  // Pirojpur
  { name: 'Pirojpur District Judge Court', name_bn: 'পিরোজপুর জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Pirojpur' },
  { name: 'Pirojpur Chief Judicial Magistrate Court', name_bn: 'পিরোজপুর চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Pirojpur' },
  // Jhalokathi
  { name: 'Jhalokathi District Judge Court', name_bn: 'ঝালকাঠি জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Jhalokathi' },
  { name: 'Jhalokathi Chief Judicial Magistrate Court', name_bn: 'ঝালকাঠি চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Jhalokathi' },
  // Sylhet
  { name: 'Sylhet District Judge Court', name_bn: 'সিলেট জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Sylhet' },
  { name: 'Sylhet Chief Judicial Magistrate Court', name_bn: 'সিলেট চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Sylhet' },
  { name: 'Sylhet Metropolitan Sessions Judge Court', name_bn: 'সিলেট মেট্রোপলিটন সেশন জজ আদালত', courtType: 'Sessions Court', districtName: 'Sylhet' },
  { name: 'Sylhet Chief Metropolitan Magistrate Court', name_bn: 'সিলেট চীফ মেট্রোপলিটন ম্যাজিস্ট্রেট আদালত', courtType: 'CMM Court', districtName: 'Sylhet' },
  // Moulvibazar
  { name: 'Moulvibazar District Judge Court', name_bn: 'মৌলভীবাজার জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Moulvibazar' },
  { name: 'Moulvibazar Chief Judicial Magistrate Court', name_bn: 'মৌলভীবাজার চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Moulvibazar' },
  // Habiganj
  { name: 'Habiganj District Judge Court', name_bn: 'হবিগঞ্জ জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Habiganj' },
  { name: 'Habiganj Chief Judicial Magistrate Court', name_bn: 'হবিগঞ্জ চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Habiganj' },
  // Sunamganj
  { name: 'Sunamganj District Judge Court', name_bn: 'সুনামগঞ্জ জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Sunamganj' },
  { name: 'Sunamganj Chief Judicial Magistrate Court', name_bn: 'সুনামগঞ্জ চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Sunamganj' },
  // Rangpur
  { name: 'Rangpur District Judge Court', name_bn: 'রংপুর জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Rangpur' },
  { name: 'Rangpur Chief Judicial Magistrate Court', name_bn: 'রংপুর চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Rangpur' },
  { name: 'Rangpur Metropolitan Sessions Judge Court', name_bn: 'রংপুর মেট্রোপলিটন সেশন জজ আদালত', courtType: 'Sessions Court', districtName: 'Rangpur' },
  { name: 'Rangpur Chief Metropolitan Magistrate Court', name_bn: 'রংপুর চীফ মেট্রোপলিটন ম্যাজিস্ট্রেট আদালত', courtType: 'CMM Court', districtName: 'Rangpur' },
  // Dinajpur
  { name: 'Dinajpur District Judge Court', name_bn: 'দিনাজপুর জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Dinajpur' },
  { name: 'Dinajpur Chief Judicial Magistrate Court', name_bn: 'দিনাজপুর চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Dinajpur' },
  // Panchagarh
  { name: 'Panchagarh District Judge Court', name_bn: 'পঞ্চগড় জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Panchagarh' },
  { name: 'Panchagarh Chief Judicial Magistrate Court', name_bn: 'পঞ্চগড় চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Panchagarh' },
  // Thakurgaon
  { name: 'Thakurgaon District Judge Court', name_bn: 'ঠাকুরগাঁও জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Thakurgaon' },
  { name: 'Thakurgaon Chief Judicial Magistrate Court', name_bn: 'ঠাকুরগাঁও চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Thakurgaon' },
  // Nilphamari
  { name: 'Nilphamari District Judge Court', name_bn: 'নীলফামারী জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Nilphamari' },
  { name: 'Nilphamari Chief Judicial Magistrate Court', name_bn: 'নীলফামারী চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Nilphamari' },
  // Lalmonirhat
  { name: 'Lalmonirhat District Judge Court', name_bn: 'লালমনিরহাট জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Lalmonirhat' },
  { name: 'Lalmonirhat Chief Judicial Magistrate Court', name_bn: 'লালমনিরহাট চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Lalmonirhat' },
  // Kurigram
  { name: 'Kurigram District Judge Court', name_bn: 'কুড়িগ্রাম জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Kurigram' },
  { name: 'Kurigram Chief Judicial Magistrate Court', name_bn: 'কুড়িগ্রাম চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Kurigram' },
  // Gaibandha
  { name: 'Gaibandha District Judge Court', name_bn: 'গাইবান্ধা জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Gaibandha' },
  { name: 'Gaibandha Chief Judicial Magistrate Court', name_bn: 'গাইবান্ধা চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Gaibandha' },
  // Mymensingh
  { name: 'Mymensingh District Judge Court', name_bn: 'ময়মনসিংহ জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Mymensingh' },
  { name: 'Mymensingh Chief Judicial Magistrate Court', name_bn: 'ময়মনসিংহ চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Mymensingh' },
  { name: 'Mymensingh Metropolitan Sessions Judge Court', name_bn: 'ময়মনসিংহ মেট্রোপলিটন সেশন জজ আদালত', courtType: 'Sessions Court', districtName: 'Mymensingh' },
  { name: 'Mymensingh Chief Metropolitan Magistrate Court', name_bn: 'ময়মনসিংহ চীফ মেট্রোপলিটন ম্যাজিস্ট্রেট আদালত', courtType: 'CMM Court', districtName: 'Mymensingh' },
  // Jamalpur
  { name: 'Jamalpur District Judge Court', name_bn: 'জামালপুর জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Jamalpur' },
  { name: 'Jamalpur Chief Judicial Magistrate Court', name_bn: 'জামালপুর চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Jamalpur' },
  // Sherpur
  { name: 'Sherpur District Judge Court', name_bn: 'শেরপুর জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Sherpur' },
  { name: 'Sherpur Chief Judicial Magistrate Court', name_bn: 'শেরপুর চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Sherpur' },
  // Netrokona
  { name: 'Netrokona District Judge Court', name_bn: 'নেত্রকোণা জেলা জজ আদালত', courtType: 'District Judge Court', districtName: 'Netrokona' },
  { name: 'Netrokona Chief Judicial Magistrate Court', name_bn: 'নেত্রকোণা চীফ জুডিসিয়াল ম্যাজিস্ট্রেট আদালত', courtType: 'Chief Judicial Magistrate Court', districtName: 'Netrokona' },
];

module.exports = courts;
