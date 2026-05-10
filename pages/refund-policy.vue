<template>
  <div class="min-h-screen bg-white py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <h1 class="text-3xl font-bold mb-8">Refund Policy for AIVoiceLab</h1>
      <div class="prose max-w-none">
        <h2 class="text-2xl font-semibold mb-6">Refund Policy</h2>
        <p class="text-gray-600 mb-6">Last updated: October 05, 2025</p>

        <p class="mb-6">Thank you for using AIVoiceLab's AI voice generation services.</p>
        <p class="mb-6">Due to the nature of digital products and services, we cannot offer refunds for change of mind. It is very important that you read the product page, title and description thoroughly before making a purchase.</p>
        <p class="mb-8">Because the services we offer are digital and cannot be returned, your purchase is only eligible for a refund in the following specific situations:</p>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Eligible Refund Situations</h2>
          
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">• You purchased duplicate services accidentally</h3>
            <p class="mb-4">We'll gladly refund you for any duplicate purchases. Just contact us with your order details and we'll process the refund promptly.</p>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">• There is a technical problem with the service</h3>
            <p class="mb-4">First, please reach out to our support team with specific information about the technical issue. If you encounter a consistently reproducible error with our AI voice generation service that cannot be resolved, please let us know.</p>
            <p class="mb-4"><strong>Note:</strong> Services with alleged technical issues will only be eligible for a refund when sufficient information is provided regarding how the error was created and our technical team confirms the issue cannot be resolved.</p>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">• The service was misrepresented in the description</h3>
            <p class="mb-4">We consider a service to be "misrepresented" when the delivered service does not match the described function in the service description, or when a feature stated to be included is not delivered.</p>
            <p class="mb-4">Misrepresentation does not include subjective opinions on the quality or appearance of the generated voice output.</p>
            <p class="mb-4"><strong>For example:</strong> A service would be misrepresented if the description promised 24/7 availability but the service was consistently down. A service would NOT be misrepresented if a user believes that the generated voice "doesn't sound good" or "isn't high quality compared to other services."</p>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Non-Eligible Refund Situations</h2>
          <p class="mb-4">We're unable to process refunds in the following situations:</p>
          <ul class="list-disc pl-6 mb-4">
            <li>You (or your client) no longer need the purchased service</li>
            <li>You found another service you like better, or you've changed your mind about your purchase</li>
            <li>You don't have sufficient technical expertise to use the service</li>
            <li>You don't have the correct software or hardware requirements (described in the service listing) to use the service</li>
            <li>You bought a service on accident, and our system shows that the service was accessed or used</li>
            <li>You feel that the generated voice output is of low quality (this is subjective and varies by user preference)</li>
            <li>You are having trouble accessing the service because your internet connection is not fast enough, is not stable, cannot handle the service requirements, or similar issues related to your internet service</li>
            <li>You claim the service is experiencing a technical issue, but are unable or unwilling to provide sufficient evidence for the technical issue</li>
            <li>Your service purchase was made over 30 days ago</li>
            <li>You have already used the service extensively (more than 50% of your purchased credits or time)</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Refund Process</h2>
          <p class="mb-4">To request a refund, please contact us at <a href="mailto:support@aivoicelab.net" class="text-blue-600 hover:underline">support@aivoicelab.net</a> with the following information:</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Your order number or transaction ID</li>
            <li>Detailed description of the issue (if applicable)</li>
            <li>Screenshots or evidence of the problem (if applicable)</li>
            <li>Your preferred refund method</li>
          </ul>
          <p class="mb-4">We will review your request within 2-3 business days and respond with our decision. Approved refunds will be processed within 5-7 business days using the same payment method you used for the original purchase.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Service Terms</h2>
          <p class="mb-4">Before purchasing our AI voice generation services, please ensure you understand:</p>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Service Requirements:</strong> Please ensure you have the required software and basic knowledge to use our service before purchasing</li>
            <li><strong>Usage Limits:</strong> All services are subject to fair use policies and usage limits as described in our Terms of Service</li>
            <li><strong>Quality Expectations:</strong> AI-generated content may vary in quality and may not always meet subjective quality expectations</li>
            <li><strong>Technical Support:</strong> We provide technical support for service-related issues, but not for general usage guidance</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Discretionary Refunds</h2>
          <p class="mb-4"><strong>All refunds are at the sole discretion of AIVoiceLab.</strong> We reserve the right to refuse any refund request that does not meet our clearly defined criteria or that we believe to be fraudulent or abusive.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Contact Us</h2>
          <p class="mb-4">If you have any questions about our Refund Policy, please contact us:</p>
          <ul class="list-disc pl-6 mb-4">
            <li>By email: <a href="mailto:support@aivoicelab.net" class="text-blue-600 hover:underline">support@aivoicelab.net</a></li>
            <li>Response time: We typically respond within 24-48 hours</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t, tm, locale } = useI18n()
const host = 'https://aivoicelab.net'

const currentDate = 'October 05, 2025'

// SEO Meta Tags
useHead({
  htmlAttrs: {
    lang: locale.value
  },
  title: t('seo.title'),
  meta: [
    { name: 'description', content: t('seo.description') },
    { name: 'keywords', content: t('seo.keywords') },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: t('seo.title') },
    { property: 'og:description', content: t('seo.description') },
    { property: 'og:url', content: 'https://aivoicelab.net' },
    { property: 'og:image', content: 'https://cdn.aivoicelab.net/img/fb-avl.jpg'},
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: t('seo.title') },
    { name: 'twitter:description', content: t('seo.description') },
    { name: 'twitter:site', content: 'https://aivoicelab.net' },
    { name: 'twitter:image', content: 'https://cdn.aivoicelab.net/img/tw-avl.jpg' }
  ]
})
</script>