export interface LocalityInfo {
  name: string;
  pincode?: string;
  baseHouseRatePerSqft: number; // For ML feature baseline & locality factor
  baseLandRatePerSqft: number;
}

export interface CityInfo {
  name: string;
  localities: LocalityInfo[];
}

export interface DistrictInfo {
  name: string;
  district?: string;
  cities: CityInfo[];
}

export const TAMIL_NADU_LOCATIONS: DistrictInfo[] = [
  {
    name: "Coimbatore",
    cities: [
      {
        name: "Pollachi",
        localities: [
          { name: "Mahalingapuram", baseHouseRatePerSqft: 4600, baseLandRatePerSqft: 2200 },
          { name: "Kovilpalayam", baseHouseRatePerSqft: 3900, baseLandRatePerSqft: 1750 },
          { name: "Anaimalai", baseHouseRatePerSqft: 3800, baseLandRatePerSqft: 1600 },
          { name: "Kinathukadavu", baseHouseRatePerSqft: 3700, baseLandRatePerSqft: 1550 },
          { name: "Suleeswaranpatti", baseHouseRatePerSqft: 4100, baseLandRatePerSqft: 1900 },
          { name: "Zamin Uthukuli", baseHouseRatePerSqft: 3600, baseLandRatePerSqft: 1500 },
          { name: "Samathur", baseHouseRatePerSqft: 3500, baseLandRatePerSqft: 1400 },
          { name: "Negamam", baseHouseRatePerSqft: 3400, baseLandRatePerSqft: 1350 },
          { name: "Vettaikaranpudur", baseHouseRatePerSqft: 3600, baseLandRatePerSqft: 1450 },
          { name: "Aliyar", baseHouseRatePerSqft: 3900, baseLandRatePerSqft: 1700 },
          { name: "Meenakshipuram", baseHouseRatePerSqft: 3500, baseLandRatePerSqft: 1400 },
          { name: "Gomangalam", baseHouseRatePerSqft: 3300, baseLandRatePerSqft: 1300 },
          { name: "Servakaranpalayam", baseHouseRatePerSqft: 3400, baseLandRatePerSqft: 1350 },
          { name: "Venkatesa Colony", baseHouseRatePerSqft: 4500, baseLandRatePerSqft: 2100 },
          { name: "Palakkad Road", baseHouseRatePerSqft: 4700, baseLandRatePerSqft: 2300 },
          { name: "Udumalpet Road", baseHouseRatePerSqft: 4400, baseLandRatePerSqft: 2050 },
          { name: "Achipatti", baseHouseRatePerSqft: 4000, baseLandRatePerSqft: 1800 },
          { name: "Kottur Road", baseHouseRatePerSqft: 4200, baseLandRatePerSqft: 1950 },
          { name: "Jothi Nagar", baseHouseRatePerSqft: 4350, baseLandRatePerSqft: 2000 },
          { name: "Nethaji Road", baseHouseRatePerSqft: 4600, baseLandRatePerSqft: 2250 },
          { name: "Pollachi Town", baseHouseRatePerSqft: 4800, baseLandRatePerSqft: 2400 }
        ]
      },
      {
        name: "Coimbatore City",
        localities: [
          { name: "RS Puram", baseHouseRatePerSqft: 7500, baseLandRatePerSqft: 4200 },
          { name: "Gandhipuram", baseHouseRatePerSqft: 7200, baseLandRatePerSqft: 4000 },
          { name: "Peelamedu", baseHouseRatePerSqft: 6800, baseLandRatePerSqft: 3700 },
          { name: "Saibaba Colony", baseHouseRatePerSqft: 6500, baseLandRatePerSqft: 3500 },
          { name: "Saravanampatti", baseHouseRatePerSqft: 5400, baseLandRatePerSqft: 2800 },
          { name: "Vadavalli", baseHouseRatePerSqft: 5200, baseLandRatePerSqft: 2600 },
          { name: "Singanallur", baseHouseRatePerSqft: 5000, baseLandRatePerSqft: 2500 },
          { name: "Ganapathy", baseHouseRatePerSqft: 5100, baseLandRatePerSqft: 2600 },
          { name: "Ramanathapuram", baseHouseRatePerSqft: 5800, baseLandRatePerSqft: 3100 }
        ]
      },
      {
        name: "Mettupalayam",
        localities: [
          { name: "Coimbatore Road", baseHouseRatePerSqft: 4100, baseLandRatePerSqft: 1800 },
          { name: "Ooty Road", baseHouseRatePerSqft: 4300, baseLandRatePerSqft: 1950 },
          { name: "Karamadai", baseHouseRatePerSqft: 3800, baseLandRatePerSqft: 1650 },
          { name: "Sirumugai", baseHouseRatePerSqft: 3400, baseLandRatePerSqft: 1400 }
        ]
      }
    ]
  },
  {
    name: "Chennai",
    cities: [
      {
        name: "Chennai Central & South",
        localities: [
          { name: "Anna Nagar", baseHouseRatePerSqft: 12500, baseLandRatePerSqft: 8500 },
          { name: "T. Nagar", baseHouseRatePerSqft: 14000, baseLandRatePerSqft: 9800 },
          { name: "Adyar", baseHouseRatePerSqft: 13500, baseLandRatePerSqft: 9200 },
          { name: "Besant Nagar", baseHouseRatePerSqft: 14500, baseLandRatePerSqft: 10200 },
          { name: "Velachery", baseHouseRatePerSqft: 8200, baseLandRatePerSqft: 5200 },
          { name: "OMR (Sholinganallur)", baseHouseRatePerSqft: 7500, baseLandRatePerSqft: 4500 },
          { name: "ECR (Thiruvanmiyur)", baseHouseRatePerSqft: 11000, baseLandRatePerSqft: 7500 },
          { name: "Porur", baseHouseRatePerSqft: 6800, baseLandRatePerSqft: 3900 },
          { name: "Tambaram", baseHouseRatePerSqft: 5800, baseLandRatePerSqft: 3100 },
          { name: "Kilpauk", baseHouseRatePerSqft: 11500, baseLandRatePerSqft: 7800 }
        ]
      }
    ]
  },
  {
    name: "Madurai",
    cities: [
      {
        name: "Madurai City",
        localities: [
          { name: "KK Nagar", baseHouseRatePerSqft: 5800, baseLandRatePerSqft: 3100 },
          { name: "Anna Nagar", baseHouseRatePerSqft: 5600, baseLandRatePerSqft: 2900 },
          { name: "Mattuthavani", baseHouseRatePerSqft: 5100, baseLandRatePerSqft: 2500 },
          { name: "Iyer Bungalow", baseHouseRatePerSqft: 4800, baseLandRatePerSqft: 2300 },
          { name: "Simmakkal", baseHouseRatePerSqft: 5400, baseLandRatePerSqft: 2800 },
          { name: "Pasumalai", baseHouseRatePerSqft: 4900, baseLandRatePerSqft: 2400 }
        ]
      }
    ]
  },
  {
    name: "Tiruchirappalli",
    cities: [
      {
        name: "Tiruchirappalli City",
        localities: [
          { name: "Thillai Nagar", baseHouseRatePerSqft: 6200, baseLandRatePerSqft: 3400 },
          { name: "Cantonment", baseHouseRatePerSqft: 5900, baseLandRatePerSqft: 3200 },
          { name: "Srirangam", baseHouseRatePerSqft: 5400, baseLandRatePerSqft: 2800 },
          { name: "KK Nagar", baseHouseRatePerSqft: 4900, baseLandRatePerSqft: 2400 }
        ]
      }
    ]
  },
  {
    name: "Salem",
    cities: [
      {
        name: "Salem City",
        localities: [
          { name: "Fairlands", baseHouseRatePerSqft: 5400, baseLandRatePerSqft: 2800 },
          { name: "Alagapuram", baseHouseRatePerSqft: 5000, baseLandRatePerSqft: 2500 },
          { name: "Hasthampatti", baseHouseRatePerSqft: 4700, baseLandRatePerSqft: 2300 },
          { name: "Meyyanur", baseHouseRatePerSqft: 4500, baseLandRatePerSqft: 2200 }
        ]
      }
    ]
  },
  {
    name: "Tiruppur",
    cities: [
      {
        name: "Tiruppur City",
        localities: [
          { name: "Avinashi Road", baseHouseRatePerSqft: 5300, baseLandRatePerSqft: 2700 },
          { name: "Dharapuram Road", baseHouseRatePerSqft: 4600, baseLandRatePerSqft: 2200 },
          { name: "Angeripalayam", baseHouseRatePerSqft: 4200, baseLandRatePerSqft: 2000 },
          { name: "Velampalayam", baseHouseRatePerSqft: 4100, baseLandRatePerSqft: 1900 }
        ]
      }
    ]
  },
  {
    name: "Erode",
    cities: [
      {
        name: "Erode City",
        localities: [
          { name: "Perundurai Road", baseHouseRatePerSqft: 5100, baseLandRatePerSqft: 2600 },
          { name: "Thindal", baseHouseRatePerSqft: 4900, baseLandRatePerSqft: 2450 },
          { name: "Brough Road", baseHouseRatePerSqft: 5300, baseLandRatePerSqft: 2750 },
          { name: "Solar", baseHouseRatePerSqft: 4300, baseLandRatePerSqft: 2100 }
        ]
      }
    ]
  },
  {
    name: "Tirunelveli",
    cities: [
      {
        name: "Tirunelveli Town",
        localities: [
          { name: "Palayamkottai", baseHouseRatePerSqft: 4600, baseLandRatePerSqft: 2200 },
          { name: "Vannarpettai", baseHouseRatePerSqft: 4800, baseLandRatePerSqft: 2400 },
          { name: "Maharaja Nagar", baseHouseRatePerSqft: 4400, baseLandRatePerSqft: 2100 }
        ]
      }
    ]
  },
  {
    name: "Dindigul",
    cities: [
      {
        name: "Dindigul Town",
        localities: [
          { name: "Palani Road", baseHouseRatePerSqft: 4200, baseLandRatePerSqft: 1950 },
          { name: "Round Road", baseHouseRatePerSqft: 4400, baseLandRatePerSqft: 2100 },
          { name: "Mengles Road", baseHouseRatePerSqft: 4100, baseLandRatePerSqft: 1900 }
        ]
      }
    ]
  },
  {
    name: "Thanjavur",
    cities: [
      {
        name: "Thanjavur Town",
        localities: [
          { name: "Medical College Road", baseHouseRatePerSqft: 4600, baseLandRatePerSqft: 2200 },
          { name: "New Bus Stand", baseHouseRatePerSqft: 4300, baseLandRatePerSqft: 2050 },
          { name: "Vallam", baseHouseRatePerSqft: 3800, baseLandRatePerSqft: 1750 }
        ]
      }
    ]
  },
  {
    name: "Kanchipuram",
    cities: [
      {
        name: "Kanchipuram Town",
        localities: [
          { name: "Gandhi Road", baseHouseRatePerSqft: 5100, baseLandRatePerSqft: 2600 },
          { name: "Ennaikaran", baseHouseRatePerSqft: 4700, baseLandRatePerSqft: 2350 },
          { name: "Orikkai", baseHouseRatePerSqft: 4300, baseLandRatePerSqft: 2050 }
        ]
      }
    ]
  },
  {
    name: "Chengalpattu",
    cities: [
      {
        name: "Chengalpattu Town",
        localities: [
          { name: "GST Road", baseHouseRatePerSqft: 5200, baseLandRatePerSqft: 2650 },
          { name: "Mahindra World City", baseHouseRatePerSqft: 5700, baseLandRatePerSqft: 3000 },
          { name: "Maraimalai Nagar", baseHouseRatePerSqft: 4900, baseLandRatePerSqft: 2450 }
        ]
      }
    ]
  },
  {
    name: "Vellore",
    cities: [
      {
        name: "Vellore City",
        localities: [
          { name: "Katpadi", baseHouseRatePerSqft: 5200, baseLandRatePerSqft: 2600 },
          { name: "Gandhi Nagar", baseHouseRatePerSqft: 5000, baseLandRatePerSqft: 2500 },
          { name: "Sathuvachari", baseHouseRatePerSqft: 4700, baseLandRatePerSqft: 2300 }
        ]
      }
    ]
  },
  {
    name: "Nilgiris",
    cities: [
      {
        name: "Ooty",
        localities: [
          { name: "Charing Cross", baseHouseRatePerSqft: 6800, baseLandRatePerSqft: 3800 },
          { name: "Coonoor Road", baseHouseRatePerSqft: 6400, baseLandRatePerSqft: 3500 },
          { name: "Lovedale", baseHouseRatePerSqft: 5900, baseLandRatePerSqft: 3200 }
        ]
      }
    ]
  },
  {
    name: "Kanniyakumari",
    cities: [
      {
        name: "Nagercoil",
        localities: [
          { name: "Kottar", baseHouseRatePerSqft: 4700, baseLandRatePerSqft: 2300 },
          { name: "Vadasery", baseHouseRatePerSqft: 4900, baseLandRatePerSqft: 2450 },
          { name: "Asambu Road", baseHouseRatePerSqft: 4400, baseLandRatePerSqft: 2150 }
        ]
      }
    ]
  }
];

// Additional Tamil Nadu districts to make the full 38 districts list complete
const OTHER_DISTRICT_NAMES = [
  "Cuddalore", "Villupuram", "Nagapattinam", "Thiruvarur", "Dharmapuri",
  "Krishnagiri", "Namakkal", "Karur", "Perambalur", "Ariyalur",
  "Pudukkottai", "Sivaganga", "Ramanathapuram", "Virudhunagar", "Theni",
  "Thoothukudi", "Tenkasi", "Tiruvallur", "Tiruvannamalai", "Ranipet",
  "Tirupathur", "Kallakurichi", "Mayiladuthurai"
];

// Enrich with standard towns for the remaining districts
OTHER_DISTRICT_NAMES.forEach((distName) => {
  if (!TAMIL_NADU_LOCATIONS.some(d => d.name === distName)) {
    TAMIL_NADU_LOCATIONS.push({
      name: distName,
      cities: [
        {
          name: `${distName} Central`,
          localities: [
            { name: "Town Center", baseHouseRatePerSqft: 4200, baseLandRatePerSqft: 1950 },
            { name: "Station Road", baseHouseRatePerSqft: 4000, baseLandRatePerSqft: 1800 },
            { name: "Bypass Junction", baseHouseRatePerSqft: 3800, baseLandRatePerSqft: 1700 }
          ]
        }
      ]
    });
  }
});
