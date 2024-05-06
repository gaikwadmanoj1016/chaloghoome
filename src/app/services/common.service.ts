import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  showHideCertificateModal: boolean = false;
  wonders: any[] = [
    { id: 1, name: "Taj Mahal", imageUrl: 'assets/imgs/wonders/taj-mahal.jpg', location: 'Taj Mahal', address: 'Agra, Delhi, India', description: 'The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor, Shah Jahan, to house the tomb of his favorite wife, Mumtaz Mahal.' },
    { id: 2, name: "Machu Picchu", imageUrl: 'assets/imgs/wonders/great-wall-of-china.jpg', location: 'Great Wall of China', address: 'China', description: 'The Great Wall of China is a series of fortifications made of stone, brick, tamped earth, wood, and other materials, generally built along an east-to-west line across the historical northern borders of China to protect the Chinese states and empires against the raids and invasions of the various nomadic groups of the Eurasian Steppe.' },
    { id: 3, name: "Eiffel Tower", imageUrl: 'assets/imgs/wonders/petra-1.jpg', location: 'Petra', address: 'Jordan', description: 'Petra is a historical and archaeological city in southern Jordan, famous for its rock-cut architecture and water conduit system. Another name for Petra is the Rose City due to the color of the stone out of which it is carved.' },
    { id: 4, name: "Great Wall of China", imageUrl: 'assets/imgs/wonders/machu-pichu.jpg', location: 'Machu Picchu', address: 'Peru', description: 'Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru on a 2,430-meter (7,970 ft) mountain ridge. It is located in the Machupicchu District within Urubamba Province above the Sacred Valley, which is 80 kilometers (50 mi) northwest of Cuzco.' },
    { id: 5, name: "Petra", imageUrl: 'assets/imgs/wonders/chichen-itza.jpg', location: 'Chichen Itza', address: 'Mexico', description: 'Chichen Itza was a large pre-Columbian city built by the Maya people of the Terminal Classic period. The archaeological site is located in Tinúm Municipality, Yucatán State, Mexico.' },
    { id: 7, name: "Chichen Itza", imageUrl: 'assets/imgs/wonders/collessium.jpg', location: 'Colosseum', address: 'Rome, Italy', description: 'The Colosseum is an oval amphitheater in the center of the city of Rome, Italy, just east of the Roman Forum. It is the largest ancient amphitheater ever built, and is still the largest standing amphitheater in the world today, despite its age.' },
    { id: 8, name: "Colosseum", imageUrl: 'assets/imgs/wonders/christ-the-redeemer.jpg', location: 'Christ the Redeemer', address: 'Rio de Janeiro, Brazil', description: 'Christ the Redeemer is an Art Deco statue of Jesus Christ in Rio de Janeiro, Brazil, created by French sculptor Paul Landowski and built by the Brazilian engineer Heitor da Silva Costa, in collaboration with the French engineer Albert Caquot. Romanian sculptor Gheorghe Leonida fashioned the face.' },
    { id: 9, name: "Christ the Redeemer", imageUrl: 'assets/imgs/wonders/petronas-towers.jpg', location: 'Petronas Towers', address: 'Kuala Lumpur, Malaysia', description: 'The Petronas Towers, also known as the Petronas Twin Towers, are twin skyscrapers in Kuala Lumpur, Malaysia. They were the tallest buildings in the world from 1998 to 2004 and remain the tallest twin towers in the world.' },
    { id: 10, name: "Petronas Towers", imageUrl: 'assets/imgs/most-visited/sydney-opera-house.jpg', location: 'Sydney Opera House', address: 'Sydney, Australia', description: 'The Sydney Opera House is a multi-venue performing arts center at Sydney Harbour in Sydney, New South Wales, Australia. It is one of the 20th century\'s most famous and distinctive buildings.' },
    { id: 11, name: "Sydney Opera House", imageUrl: 'assets/imgs/wonders/stonehenge.jpg', location: 'Stonehenge', address: 'Wiltshire, England', description: 'Stonehenge is a prehistoric monument in Wiltshire, England, two miles (3 km) west of Amesbury. It consists of a ring of standing stones, each around 13 feet (4.0 m) high, seven feet (2.1 m) wide, and weighing around 25 tons.' },
    { id: 12, name: "Stonehenge", imageUrl: 'assets/imgs/wonders/parthenon.jpg', location: 'Parthenon', address: 'Athens, Greece', description: 'The Parthenon is a former temple on the Athenian Acropolis, Greece, dedicated to the goddess Athena, whom the people of Athens considered their patron.' }

  ];
  hiddenGems: any[] = [
    { "id": 13, imageUrl: 'assets/imgs/hidden-gems/sapa-vietnam.jpg', location: 'Sapa, Vietnam', address: 'Lào Cai Province, Vietnam', description: 'Sapa is a town in the Hoàng Liên Son Mountains of northwestern Vietnam. A popular trekking base, it overlooks the terraced rice fields of the Muong Hoa Valley, and is near the 3,143m-tall Phang Xi Pang peak, which is climbable via a steep, multiday guided walk.' },
    { "id": 14, imageUrl: 'assets/imgs/hidden-gems/valley-of-flowers.jpg', location: 'Valley of Flowers National Park', address: 'Uttarakhand, India', description: 'Valley of Flowers National Park is an Indian national park, located in North Chamoli, in the state of Uttarakhand and is known for its meadows of endemic alpine flowers and the variety of flora.' },
    { "id": 15, imageUrl: 'assets/imgs/hidden-gems/cappadocia.jpg', location: 'Cappadocia', address: 'Turkey', description: 'Cappadocia, a semi-arid region in central Turkey, is known for its distinctive "fairy chimneys," tall, cone-shaped rock formations clustered in Monks Valley, Göreme and elsewhere.' },
    { "id": 16, imageUrl: 'assets/imgs/hidden-gems/socotra.png', location: 'Socotra', address: 'Yemen', description: 'Socotra, an island in the Indian Ocean, is known for its dramatic landscapes, including white sandy beaches, limestone plateaus, and the Dragon\'s Blood Trees which are unique to the island.' },
    { "id": 17, imageUrl: 'assets/imgs/hidden-gems/lauterbrunnen.jpg', location: 'Lauterbrunnen Valley', address: 'Switzerland', description: 'Lauterbrunnen Valley is a valley in the Bernese Alps in Switzerland, and is known for its stunning valley views, majestic waterfalls, and access to some of the best hiking trails in the region.' },
    { "id": 18, imageUrl: 'assets/imgs/hidden-gems/faroe-islands.jpg', location: 'Faroe Islands', address: 'Denmark', description: 'The Faroe Islands, an autonomous territory within the Kingdom of Denmark, is known for its rugged landscape, sheep farms, and birdlife, including puffins.' },
    { "id": 19, imageUrl: 'assets/imgs/hidden-gems/bagan.jpg', location: 'Bagan', address: 'Myanmar', description: 'Bagan is an ancient city located in the Mandalay Region of Myanmar. From the 9th to 13th centuries, the city was the capital of the Kingdom of Pagan, the first kingdom to unify the regions that would later constitute modern Myanmar.' },
    { "id": 20, imageUrl: 'assets/imgs/hidden-gems/svalbard.jpg', location: 'Svalbard', address: 'Norway', description: 'Svalbard is a Norwegian archipelago in the Arctic Ocean. Situated north of mainland Europe, it is about midway between continental Norway and the North Pole.' },
    { "id": 21, imageUrl: 'assets/imgs/hidden-gems/sagano-bamboo-forest.jpg', location: 'Sagano Bamboo Forest', address: 'Kyoto, Japan', description: 'The Sagano Bamboo Forest is a natural forest of bamboo in Arashiyama, Kyoto, Japan. The forest consists of several pathways for tourists and visitors.' }

  ];
  mostVisited: any[] = [
    { "id": 22, imageUrl: 'assets/imgs/most-visited/eiffel-tower.jpg', location: 'Eiffel Tower', address: 'Paris, France', description: 'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.' },
    { "id": 23, imageUrl: 'assets/imgs/most-visited/statue-of-liberty.jpg', location: 'Statue of Liberty', address: 'New York City, USA', description: 'The Statue of Liberty is a colossal neoclassical sculpture on Liberty Island in New York Harbor in New York City, in the United States. The copper statue, a gift from the people of France to the people of the United States, was designed by French sculptor Frédéric Auguste Bartholdi and its metal framework was built by Gustave Eiffel.' },
    { "id": 24, imageUrl: 'assets/imgs/most-visited/pyramids-of-giza.jpg', location: 'Pyramids of Giza', address: 'Cairo, Egypt', description: 'The Giza Pyramid Complex, also called the Giza Necropolis, is the site on the Giza Plateau in Egypt that includes the Great Pyramid of Giza, the Pyramid of Khafre, and the Pyramid of Menkaure, along with their associated pyramid complexes and the Great Sphinx of Giza.' },
    { "id": 1, imageUrl: 'assets/imgs/wonders/machu-pichu.jpg', location: 'Machu Picchu', address: 'Peru', description: 'Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru on a 2,430-meter (7,970 ft) mountain ridge. It is located in the Machupicchu District within Urubamba Province above the Sacred Valley, which is 80 kilometers (50 mi) northwest of Cuzco.' },
    { "id": 2, imageUrl: 'assets/imgs/wonders/taj-mahal.jpg', location: 'Taj Mahal', address: 'Agra, Delhi, India', description: 'The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor, Shah Jahan, to house the tomb of his favorite wife, Mumtaz Mahal.' },
    { "id": 11, imageUrl: 'assets/imgs/most-visited/sydney-opera-house.jpg', location: 'Sydney Opera House', address: 'Sydney, Australia', description: 'The Sydney Opera House is a multi-venue performing arts center at Sydney Harbour in Sydney, New South Wales, Australia. It is one of the 20th century\'s most famous and distinctive buildings.' },
    { "id": 8, imageUrl: 'assets/imgs/wonders/collessium.jpg', location: 'Colosseum', address: 'Rome, Italy', description: 'The Colosseum is an oval amphitheater in the center of the city of Rome, Italy, just east of the Roman Forum. It is the largest ancient amphitheater ever built, and is still the largest standing amphitheater in the world today, despite its age.' },
    { "id": 25, imageUrl: 'assets/imgs/most-visited/santorini.jpg', location: 'Santorini', address: 'Greece', description: 'Santorini is an island in the southern Aegean Sea, about 200 km southeast of Greece\'s mainland. It is the largest island of a small, circular archipelago, which bears the same name and is the remnant of a volcanic caldera.' },
    { "id": 26, imageUrl: 'assets/imgs/most-visited/angkor-wat.jpg', location: 'Angkor Wat', address: 'Siem Reap, Cambodia', description: 'Angkor Wat is a temple complex in Cambodia and the largest religious monument in the world, with the site measuring 162.6 hectares.' },
    { "id": 27, imageUrl: 'assets/imgs/most-visited/sydney-harbour.jpg', location: 'Sydney Harbour Bridge', address: 'Sydney, Australia', description: 'The Sydney Harbour Bridge is a heritage-listed steel through arch bridge across Sydney Harbour that carries rail, vehicular, bicycle, and pedestrian traffic between the Sydney central business district and the North Shore.' },
    { "id": 28, imageUrl: 'assets/imgs/most-visited/niagara-falls.jpg', location: 'Niagara Falls', address: 'Ontario, Canada and New York, USA', description: 'Niagara Falls is a group of three waterfalls at the southern end of Niagara Gorge, spanning the border between the province of Ontario in Canada and the state of New York in the United States.' },
    { "id": 29, imageUrl: 'assets/imgs/most-visited/mount-fuji.jpg', location: 'Mount Fuji', address: 'Honshu Island, Japan', description: 'Mount Fuji, located on Honshu Island, is the highest mountain in Japan at 3,776.24 m (12,389 ft) and is one of Japan\'s "Three Holy Mountains" along with Mount Tate and Mount Haku.' },
    { "id": 30, imageUrl: 'assets/imgs/most-visited/masai-mara.jpg', location: 'Masai Mara National Reserve', address: 'Kenya', description: 'The Maasai Mara National Reserve is a large game reserve in Narok County, Kenya, contiguous with the Serengeti National Park in Tanzania. It is named in honor of the Maasai people, the ancestral inhabitants of the area, who migrated to the area from the Nile Basin.' },
    { "id": 31, imageUrl: 'assets/imgs/most-visited/hiroshima-peace-memorial.jpg', location: 'Hiroshima Peace Memorial', address: 'Hiroshima, Japan', description: 'The Hiroshima Peace Memorial, originally the Hiroshima Prefectural Industrial Promotion Hall, is the historic building that remains closest to the hypocenter of the atomic bomb explosion on 6 August 1945.' }
  ];

  constructor(private router: Router) { }


  // 
  
  public getFormOptionArgs() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return headers;
  }
  public getRequestOptionArgs() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    });
    return headers;
  }

  public getRequestForAttachment() {
    const headers = new HttpHeaders({
      'Accept': '*/*',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    });
    return headers;
  }


  // 
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
  navigateToQueryParams(path: string, query: any) {
    this.router.navigate([path], { queryParams: query });
  }

  scrollToDiv(elementId: string | null): void {
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
