import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Halal Travels Club',
  description: 'Terms and Conditions for Destination Discoveries FZCO / Halal Travels Club \u2014 www.halaltravelsclub.com',
}

const sections = [
  {
    title: '1. Introduction',
    body: `Thank you for choosing Destination Discoveries FZCO / Halal Travels Club for your travel needs. By booking any of our holiday packages or using our website www.halaltravelsclub.com, you acknowledge that you have read, understood, and agreed to the Terms & Conditions outlined below.\n\nWe request you to review these terms carefully before booking any package, as they form the basis of your contract with us.`,
  },
  {
    title: '2. Services Provided',
    body: `We offer:\n\u2022 Holiday packages across Europe, Africa, Asia & South America\n\u2022 Ground arrangements, including hotels, transfers, and tours\n\u2022 Custom halal-friendly travel itineraries`,
  },
  {
    title: '3. Pricing Details',
    body: `We provide competitively priced travel packages tailored to suit customer budgets and preferences.\n\nPlease note:\n\u2022 Package prices do not include tips to drivers/guides, passport fees, visa fees, meals not specified in the itinerary, or personal expenses.\n\u2022 Prices are subject to change due to supplier adjustments, currency fluctuations, availability, and seasonal variations.\n\u2022 Quoted prices are valid only at the time of confirmation.\n\nWe strive to offer the best value along with a smooth and efficient booking process.`,
  },
  {
    title: '4. Payment Terms',
    body: `All charges are in AED unless stated otherwise.\n\n\u2022 UAE Cards: 2.30% processing fee\n\u2022 International Cards: 2.75% processing fee\n\u2022 Transaction Fee: AED 1 per transaction\n\u2022 One-Time Setup Fee: AED 5,000 (if applicable)\n\u2022 Settlement Period: T + 7 days\n\nPayment confirmations will be sent via email or WhatsApp.`,
  },
  {
    title: '5. Payment Methods',
    body: `We offer secure and convenient payment options, including:\n\u2022 Online payment\n\u2022 Secure payment link issued by our authorised representative\n\u2022 Bank deposit or transfer\n\u2022 Cash payments at our office (where applicable)\n\nImportant:\n\u2022 We do not store your card information and strictly follow UAE digital payment compliance standards.\n\u2022 We cannot provide refunds for meals, sightseeing activities, or services that were previously selected and later opted not to use.`,
  },
  {
    title: '6. Payment Confirmation',
    body: `Once your payment is successfully processed, you will receive an official payment confirmation via email or WhatsApp.`,
  },
  {
    title: '7. Ticketing Policy (Flights & Other Transport)',
    body: `7.1 Ticket Issuance\n\u2022 Tickets are issued only after full payment is received\n\u2022 All tickets are governed by airline or carrier fare rules\n\u2022 Passenger names must exactly match passport details\n\n7.2 Changes & Amendments\n\u2022 Ticket changes depend on airline policies, availability, and penalties\n\u2022 Fare differences and service charges are payable by the customer\n\u2022 Changes are not guaranteed\n\u2022 Kindly ensure all information provided (name, passport details, travel dates, contact information) is accurate to avoid delays or booking issues\n\n7.3 Cancellations & Refunds (Ticketing)\n\u2022 Most tickets are non-refundable\n\u2022 Refund eligibility depends entirely on airline rules\n\u2022 Service fees, taxes, and transaction charges are non-refundable\n\u2022 Refund processing timelines depend on airline approval\n\n7.4 No-Show & Missed Flights\n\u2022 No-shows may result in complete loss of ticket value\n\u2022 Rebooking or refunds are subject to airline rules only\n\n7.5 Airline Schedule Changes\n\u2022 Airlines may change schedules without prior notice\n\u2022 We are not responsible for delays, cancellations, or missed connections\n\n7.6 Disclaimer\nDestination Discoveries FZCO / Halal Travels Club acts solely as an intermediary between customers and third-party service providers (including airlines, hotels, transport operators, and tour suppliers). We shall not be held responsible for any acts, omissions, delays, cancellations, overbookings, schedule changes, or service failures caused by such third parties.`,
  },
  {
    title: '8. Cancellation Policy',
    body: `\u2022 Most bookings are non-refundable, as we work with global suppliers who enforce strict cancellation rules.\n\u2022 Refunds, if any, depend solely on the policies of the hotel, tour operator, or service provider involved.\n\u2022 Meals, tickets, sightseeing activities, and visa fees are non-refundable once confirmed.\n\u2022 Once booking confirmation is issued, rescheduling or modifications may not be possible.\n\u2022 Customers are responsible for understanding all cancellation terms before confirming payment.`,
  },
  {
    title: '9. Itinerary Adjustments',
    body: `All itineraries mentioned in our packages are subject to change based on:\n\u2022 Weather conditions\n\u2022 Airline schedule changes\n\u2022 Hotel availability\n\u2022 Local regulations or unforeseen events\n\nIf any change occurs, we will provide an alternative option of similar value depending on availability. Notifications will be sent via email or SMS prior to departure.\n\nNote: Destination Discoveries FZCO will not be responsible for:\n\u2022 Early/late check-in or check-out decisions made by the customer\n\u2022 Missed services due to customer delays`,
  },
  {
    title: '10. Travel Insurance & Customer Responsibilities',
    body: `Destination Discoveries FZCO is not responsible for:\n\u2022 Loss of luggage\n\u2022 Travel delays\n\u2022 Accidents, injury, or medical emergencies\n\u2022 Trip cancellations initiated by the customer\n\nCustomers are strongly advised to:\n\u2022 Arrange comprehensive travel insurance before departure\n\u2022 Ensure passports and other travel documents are valid\n\u2022 Carry all relevant documents (visa, tickets, insurance, IDs) securely\n\u2022 Comply with immigration and health requirements of the destination country\n\nTo the maximum extent permitted under UAE law, Destination Discoveries FZCO's liability, if any, shall be limited to the amount actually paid by the customer for the specific service booked. We shall not be liable for indirect, incidental, or consequential damages.`,
  },
  {
    title: '11. Force Majeure',
    body: `Destination Discoveries FZCO shall not be liable for any failure or delay in performance caused by events beyond reasonable control, including but not limited to natural disasters, extreme weather conditions, pandemics, government restrictions, strikes, airline disruptions, war, or other force majeure events. Refunds, rescheduling, or alternatives shall be handled on a case-by-case basis subject to supplier policies.`,
  },
  {
    title: '12. Intellectual Property',
    body: `All content on www.halaltravelsclub.com, including logos, images, package descriptions, pricing, and website content is the exclusive property of Destination Discoveries FZCO. You may not copy, reproduce, modify, publish, or use our content without written authorisation.`,
  },
  {
    title: '13. Governing Law',
    body: `These Terms & Conditions are governed by the laws of the United Arab Emirates. Any disputes arising will fall under the jurisdiction of UAE courts.`,
  },
]

function LegalPage({
  title,
  breadcrumb,
  updated,
  sections,
}: {
  title: string
  breadcrumb: string
  updated: string
  sections: { title: string; body: string }[]
}) {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <section className="bg-gradient-to-br from-[#0B1F3A] via-teal-800 to-[#0B2040] text-white py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-teal-300 text-xs font-bold uppercase tracking-[0.18em] mb-2">
            Halal Travels Club › {breadcrumb}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-white/50 text-sm">Last updated: {updated}</p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-14 max-w-3xl">
        <div className="space-y-8">
          {sections.map(({ title: st, body }) => (
            <div key={st} className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="text-base font-bold text-gray-900 mb-3">{st}</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-teal-200 bg-teal-50 p-6 text-center">
          <p className="text-gray-600 text-sm mb-3">Questions about a booking or specific policy?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-teal-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function TermsPage() {
  return <LegalPage title="Terms & Conditions" breadcrumb="Terms & Conditions" updated="1 January 2026" sections={sections} />
}
