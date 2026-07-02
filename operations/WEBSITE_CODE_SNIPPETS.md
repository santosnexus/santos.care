# WEBSITE CODE SNIPPETS
## Ready-to-Paste HTML/CSS/JS for Website Updates
### Heal India Medi Tourism | Version 1.0 | June 2026

---

## TABLE OF CONTENTS

1. [Partner Hospitals Section](#1-partner-hospitals-section)
2. [Ayush Prana Partner Section](#2-ayush-prana-partner-section)
3. [Floating WhatsApp Button](#3-floating-whatsapp-button)
4. [Country Landing Page Template](#4-country-landing-page-template)
5. [MS Treatment Landing Page Content](#5-ms-treatment-landing-page-content)
6. [Treatment Comparison Table](#6-treatment-comparison-table)
7. [Inline Lead Capture Form](#7-inline-lead-capture-form)
8. [Testimonial Card Component](#8-testimonial-card-component)
9. [Cost Comparison Widget](#9-cost-comparison-widget)
10. [Implementation Notes](#10-implementation-notes)

---

## 1. PARTNER HOSPITALS SECTION

### HTML — Add to Homepage (Replace Generic "150+ Hospitals" Text)

```html
<!-- ADD THIS SECTION TO HOMEPAGE, REPLACE EXISTING GENERIC TEXT -->

<section class="partner-hospitals" style="background: #f8f9fa; padding: 60px 0;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
    
    <h2 style="text-align: center; color: #1a5276; font-size: 32px; margin-bottom: 10px;">
      Trusted Hospital Partners in Kerala
    </h2>
    <p style="text-align: center; color: #666; font-size: 16px; margin-bottom: 40px;">
      JCI and NABH accredited hospitals with dedicated international patient services
    </p>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
      
      <!-- Hospital 1: Aster Medcity -->
      <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; transition: transform 0.3s;">
        <div style="background: #1a5276; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; display: inline-block; margin-bottom: 15px;">
          JCI + NABH Accredited
        </div>
        <h3 style="color: #1a5276; font-size: 20px; margin-bottom: 5px;">Aster Medcity</h3>
        <p style="color: #666; font-size: 14px;">Kochi, Kerala</p>
        <p style="color: #555; font-size: 13px; margin: 15px 0;">
          Multi-specialty excellence in Cardiac Sciences, Neurosciences, Orthopedics, and Organ Transplants
        </p>
        <span style="color: #28a745; font-size: 12px;">✓ International Patient Desk</span>
      </div>
      
      <!-- Hospital 2: Amrita Hospital -->
      <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; transition: transform 0.3s;">
        <div style="background: #1a5276; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; display: inline-block; margin-bottom: 15px;">
          JCI + NABH Accredited
        </div>
        <h3 style="color: #1a5276; font-size: 20px; margin-bottom: 5px;">Amrita Hospital</h3>
        <p style="color: #666; font-size: 14px;">Thrissur, Kerala</p>
        <p style="color: #555; font-size: 13px; margin: 15px 0;">
          Super-specialty care in Cardiology, Neurosurgery, Oncology, and Comprehensive Cancer Centre
        </p>
        <span style="color: #28a745; font-size: 12px;">✓ International Patient Desk</span>
      </div>
      
      <!-- Hospital 3: Rajagiri Hospital -->
      <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; transition: transform 0.3s;">
        <div style="background: #2e86ab; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; display: inline-block; margin-bottom: 15px;">
          NABH Accredited
        </div>
        <h3 style="color: #1a5276; font-size: 20px; margin-bottom: 5px;">Rajagiri Hospital</h3>
        <p style="color: #666; font-size: 14px;">Aluva, Kochi</p>
        <p style="color: #555; font-size: 13px; margin: 15px 0;">
          Multi-specialty care in Cardiology, Orthopedics, Neurology, and General Surgery
        </p>
        <span style="color: #28a745; font-size: 12px;">✓ Near Airport (15 mins)</span>
      </div>
      
    </div>
    
    <p style="text-align: center; margin-top: 30px; color: #666;">
      <em>All hospitals include airport transfers, interpreter services, and dedicated coordinators.</em>
    </p>
    
  </div>
</section>

<style>
.partner-hospitals .hospital-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}
</style>
```

---

## 2. AYUSH PRANA PARTNER SECTION

### HTML — Add to About Page or Partners Page

```html
<!-- AYUSH PRANA PARTNER SECTION -->

<section class="ayush-prana-partner" style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 80px 0; color: white;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
    
    <div style="text-align: center; margin-bottom: 50px;">
      <h2 style="font-size: 36px; margin-bottom: 15px;">
        Our Ayurveda Recovery Partner
      </h2>
      <p style="font-size: 18px; opacity: 0.95;">
        Complete healing through integrated modern medicine + traditional Ayurveda
      </p>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;">
      
      <!-- Left: Image/Logo Area -->
      <div style="text-align: center;">
        <div style="background: white; border-radius: 20px; padding: 60px 40px; display: inline-block;">
          <h3 style="color: #27ae60; font-size: 32px; margin-bottom: 10px;">AYUSH PRANA</h3>
          <p style="color: #666; font-size: 14px;">AYURVEDIC HOSPITAL</p>
          <div style="margin-top: 20px;">
            <span style="background: #27ae60; color: white; padding: 8px 20px; border-radius: 20px; font-size: 12px;">
              ✓ CONFIRMED PARTNER
            </span>
          </div>
        </div>
      </div>
      
      <!-- Right: Content -->
      <div>
        <h3 style="font-size: 28px; margin-bottom: 20px;">
          Post-Treatment Ayurvedic Recovery
        </h3>
        
        <p style="font-size: 16px; line-height: 1.8; margin-bottom: 25px; opacity: 0.95;">
          After your treatment at our partner hospitals, recover with authentic 
          Panchakarma and Ayurvedic therapies at Ayush Prana — our trusted 
          partner for post-surgical rehabilitation and wellness.
        </p>
        
        <ul style="list-style: none; padding: 0; margin-bottom: 30px;">
          <li style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.2);">
            ✓ <strong>Panchakarma</strong> — Traditional detox and rejuvenation
          </li>
          <li style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.2);">
            ✓ <strong>Post-Surgical Recovery</strong> — Specialised rehabilitation protocols
          </li>
          <li style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.2);">
            ✓ <strong>MS Treatment (PAMS Protocol)</strong> — Specialised Multiple Sclerosis care
          </li>
          <li style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.2);">
            ✓ <strong>Yoga & Meditation</strong> — Daily sessions for holistic healing
          </li>
          <li style="padding: 10px 0;">
            ✓ <strong>Kerala Diet</strong> — Special meals prepared for your healing
          </li>
        </ul>
        
        <a href="/treatments/ayurveda" style="background: white; color: #27ae60; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: bold; display: inline-block;">
          Learn About Ayurveda Recovery →
        </a>
      </div>
      
    </div>
    
  </div>
</section>

<!-- Responsive styles -->
<style>
@media (max-width: 768px) {
  .ayush-prana-partner .content-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
```

---

## 3. FLOATING WHATSAPP BUTTON

### HTML + CSS + JS — Add Before `</body>` Tag on All Pages

```html
<!-- FLOATING WHATSAPP BUTTON — Add before </body> -->

<style>
/* WhatsApp Floating Button Styles */
.whatsapp-float-btn {
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #25D366;
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  text-decoration: none;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
  transition: all 0.3s ease;
  animation: whatsapp-pulse 2s infinite;
}

.whatsapp-float-btn:hover {
  background: #128C7E;
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
}

.whatsapp-float-btn img {
  width: 28px;
  height: 28px;
}

.whatsapp-float-btn .whatsapp-text {
  display: none;
}

.whatsapp-float-btn:hover .whatsapp-text {
  display: inline;
}

/* Show text on larger screens */
@media (min-width: 1024px) {
  .whatsapp-float-btn .whatsapp-text {
    display: inline;
  }
}

@keyframes whatsapp-pulse {
  0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
}

/* Mobile: Smaller button */
@media (max-width: 480px) {
  .whatsapp-float-btn {
    bottom: 15px;
    right: 15px;
    padding: 15px;
    border-radius: 50%;
  }
  .whatsapp-float-btn img {
    width: 32px;
    height: 32px;
  }
}
</style>

<a href="https://wa.me/918089084080?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20treatment%20options%20at%20Heal%20India%20Medi%20Tourism." 
   class="whatsapp-float-btn" 
   target="_blank"
   rel="noopener noreferrer">
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width: 28px; height: 28px;">
  <span class="whatsapp-text">Chat with us</span>
</a>
```

---

## 4. COUNTRY LANDING PAGE TEMPLATE

### HTML Template — Save as `/kenya.html` (or duplicate for other countries)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Medical Tourism from Kenya to India | Heal India Medi Tourism</title>
  <meta name="description" content="Affordable world-class treatment in India for Kenyan patients. Cardiac surgery, cancer treatment, IVF, orthopedics. Save 70% vs Kenya private care. JCI hospitals, Ayurveda recovery.">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Medical Tourism from Kenya to India | Heal India Medi Tourism">
  <meta property="og:description" content="Save 70% on world-class treatment in India. Trusted by Kenyan patients. JCI hospitals, Ayurveda recovery.">
  <meta property="og:type" content="website">
  
  <link rel="canonical" href="https://www.santos.care/kenya">
</head>
<body>

<!-- HERO SECTION -->
<section style="background: linear-gradient(135deg, #1a5276 0%, #2e86ab 100%); padding: 100px 20px; text-align: center; color: white;">
  <div style="max-width: 900px; margin: 0 auto;">
    <div style="background: white; color: #1a5276; display: inline-block; padding: 8px 20px; border-radius: 20px; font-size: 14px; margin-bottom: 20px;">
      🌍 Serving Kenyan Patients Since 2009
    </div>
    <h1 style="font-size: 48px; margin-bottom: 20px; line-height: 1.2;">
      Medical Tourism from Kenya to India
    </h1>
    <p style="font-size: 20px; opacity: 0.95; margin-bottom: 30px;">
      World-class treatment. <strong>Save 70%</strong> compared to private healthcare in Kenya. 
      Trusted by 2,000+ Kenyan patients.
    </p>
    <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
      <a href="https://wa.me/918089084080?text=Hello%2C%20I%27m%20from%20Kenya%20and%20interested%20in%20treatment%20in%20India" 
         style="background: #25D366; color: white; padding: 15px 30px; border-radius: 30px; text-decoration: none; font-weight: bold;">
        💬 WhatsApp Us Now
      </a>
      <a href="#treatment-costs" 
         style="background: white; color: #1a5276; padding: 15px 30px; border-radius: 30px; text-decoration: none; font-weight: bold;">
        View Treatment Costs
      </a>
    </div>
  </div>
</section>

<!-- WHY KENYAN PATIENTS CHOOSE INDIA -->
<section style="padding: 80px 20px; background: white;">
  <div style="max-width: 1000px; margin: 0 auto;">
    <h2 style="text-align: center; color: #1a5276; font-size: 36px; margin-bottom: 15px;">
      Why Kenyan Patients Choose India
    </h2>
    <p style="text-align: center; color: #666; font-size: 18px; margin-bottom: 50px;">
      India offers treatment at a fraction of the cost with equivalent or better quality
    </p>
    
    <!-- Cost Comparison Table -->
    <div id="treatment-costs" style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
        <thead>
          <tr style="background: #1a5276; color: white;">
            <th style="padding: 15px; text-align: left;">Treatment</th>
            <th style="padding: 15px; text-align: center;">Kenya (Private)</th>
            <th style="padding: 15px; text-align: center; background: #2e86ab;">India (Heal India)</th>
            <th style="padding: 15px; text-align: center;">You Save</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #f8f9fa; border-bottom: 1px solid #eee;">
            <td style="padding: 15px;">Heart Bypass Surgery</td>
            <td style="padding: 15px; text-align: center;">$25,000 - $35,000</td>
            <td style="padding: 15px; text-align: center; background: #e8f5e9; font-weight: bold;">$4,500 - $6,000</td>
            <td style="padding: 15px; text-align: center; color: #28a745; font-weight: bold;">Up to 80%</td>
          </tr>
          <tr style="background: white; border-bottom: 1px solid #eee;">
            <td style="padding: 15px;">Knee Replacement</td>
            <td style="padding: 15px; text-align: center;">$12,000 - $18,000</td>
            <td style="padding: 15px; text-align: center; background: #e8f5e9; font-weight: bold;">$4,000 - $6,000</td>
            <td style="padding: 15px; text-align: center; color: #28a745; font-weight: bold;">Up to 70%</td>
          </tr>
          <tr style="background: #f8f9fa; border-bottom: 1px solid #eee;">
            <td style="padding: 15px;">Cancer Treatment</td>
            <td style="padding: 15px; text-align: center;">$20,000 - $50,000</td>
            <td style="padding: 15px; text-align: center; background: #e8f5e9; font-weight: bold;">$8,000 - $15,000</td>
            <td style="padding: 15px; text-align: center; color: #28a745; font-weight: bold;">Up to 70%</td>
          </tr>
          <tr style="background: white; border-bottom: 1px solid #eee;">
            <td style="padding: 15px;">IVF Treatment</td>
            <td style="padding: 15px; text-align: center;">$5,000 - $8,000</td>
            <td style="padding: 15px; text-align: center; background: #e8f5e9; font-weight: bold;">$2,500 - $3,500</td>
            <td style="padding: 15px; text-align: center; color: #28a745; font-weight: bold;">Up to 55%</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 15px;">Spine Surgery</td>
            <td style="padding: 15px; text-align: center;">$15,000 - $30,000</td>
            <td style="padding: 15px; text-align: center; background: #e8f5e9; font-weight: bold;">$6,000 - $10,000</td>
            <td style="padding: 15px; text-align: center; color: #28a745; font-weight: bold;">Up to 65%</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p style="text-align: center; margin-top: 15px; color: #666; font-size: 14px;">
      <em>Prices are estimates. Final cost depends on treatment specifics. Get a free quote for your case.</em>
    </p>
  </div>
</section>

<!-- OUR PROCESS FOR KENYAN PATIENTS -->
<section style="padding: 80px 20px; background: #f8f9fa;">
  <div style="max-width: 1000px; margin: 0 auto;">
    <h2 style="text-align: center; color: #1a5276; font-size: 36px; margin-bottom: 50px;">
      How It Works — Step by Step
    </h2>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 30px;">
      
      <div style="background: white; padding: 30px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
        <div style="background: #1a5276; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 24px; font-weight: bold;">1</div>
        <h3 style="color: #1a5276; margin-bottom: 10px;">Send Your Reports</h3>
        <p style="color: #666; font-size: 14px;">WhatsApp us your medical reports. Our doctors review your case within 24 hours.</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
        <div style="background: #1a5276; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 24px; font-weight: bold;">2</div>
        <h3 style="color: #1a5276; margin-bottom: 10px;">Get Treatment Plan</h3>
        <p style="color: #666; font-size: 14px;">Receive a detailed treatment plan with costs and hospital options within 24 hours.</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
        <div style="background: #1a5276; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 24px; font-weight: bold;">3</div>
        <h3 style="color: #1a5276; margin-bottom: 10px;">Visa & Travel</h3>
        <p style="color: #666; font-size: 14px;">We help with e-Visa documents, flight booking, and airport pickup in Kochi.</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
        <div style="background: #1a5276; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 24px; font-weight: bold;">4</div>
        <h3 style="color: #1a5276; margin-bottom: 10px;">Treatment & Recovery</h3>
        <p style="color: #666; font-size: 14px;">Airport pickup, hospital admission, surgery, and Ayurveda recovery included.</p>
      </div>
      
    </div>
    
    <div style="text-align: center; margin-top: 40px;">
      <a href="https://wa.me/918089084080?text=Hello%2C%20I%27m%20from%20Kenya%20and%20interested%20in%20treatment%20in%20India" 
         style="background: #25D366; color: white; padding: 18px 40px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 18px;">
        💬 Start Your Journey — WhatsApp Now
      </a>
    </div>
    
  </div>
</section>

<!-- CTA SECTION -->
<section style="padding: 80px 20px; background: linear-gradient(135deg, #1a5276 0%, #2e86ab 100%); text-align: center; color: white;">
  <div style="max-width: 700px; margin: 0 auto;">
    <h2 style="font-size: 36px; margin-bottom: 20px;">
      Ready to Get Started?
    </h2>
    <p style="font-size: 18px; margin-bottom: 30px; opacity: 0.95;">
      Join 2,000+ Kenyan patients who trusted Heal India Medi Tourism 
      for their healthcare needs. Get a free treatment plan within 24 hours.
    </p>
    <a href="https://wa.me/918089084080?text=Hello%2C%20I%27m%20from%20Kenya%20and%20interested%20in%20treatment%20in%20India" 
       style="background: #25D366; color: white; padding: 20px 50px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block;">
      💬 Chat on WhatsApp
    </a>
  </div>
</section>

</body>
</html>
```

---

## 5. MS TREATMENT LANDING PAGE CONTENT

### HTML Content — Add to `/treatments/ms-treatment.html` (Update existing Ayurveda page)

```html
<!-- MS TREATMENT LANDING PAGE CONTENT -->

<!-- Page Title Section -->
<section style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 80px 20px; text-align: center; color: white;">
  <div style="max-width: 900px; margin: 0 auto;">
    <div style="background: rgba(255,255,255,0.2); display: inline-block; padding: 8px 20px; border-radius: 20px; font-size: 14px; margin-bottom: 20px;">
      🧠 Specialised Treatment Programme
    </div>
    <h1 style="font-size: 48px; margin-bottom: 20px;">
      Multiple Sclerosis (MS) Treatment in India
    </h1>
    <p style="font-size: 20px; opacity: 0.95; margin-bottom: 30px;">
      Integrated treatment combining advanced neurology with authentic 
      Panchakarma and Ayurvedic rehabilitation. <strong>2,500+ MS patients 
      treated since 2001.</strong>
    </p>
    <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
      <a href="https://wa.me/918089084080?text=Hello%2C%20I%27m%20interested%20in%20MS%20treatment%20in%20India" 
         style="background: white; color: #27ae60; padding: 15px 30px; border-radius: 30px; text-decoration: none; font-weight: bold;">
        Get Free Treatment Plan
      </a>
    </div>
  </div>
</section>

<!-- WHY MS PATIENTS CHOOSE INDIA -->
<section style="padding: 80px 20px; background: white;">
  <div style="max-width: 1000px; margin: 0 auto;">
    <h2 style="text-align: center; color: #1a5276; font-size: 36px; margin-bottom: 15px;">
      Why MS Patients Choose India via Heal India
    </h2>
    <p style="text-align: center; color: #666; margin-bottom: 50px;">
      Cost savings of 70-80% compared to Europe/USA, with proven treatment outcomes
    </p>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
      
      <div style="border: 2px solid #27ae60; border-radius: 12px; padding: 25px;">
        <h3 style="color: #27ae60; font-size: 24px; margin-bottom: 15px;">💰 Cost Savings</h3>
        <p style="color: #666; margin-bottom: 10px;">
          <strong>Stem Cell Therapy:</strong> $15,000-25,000 in India vs $80,000-150,000 abroad
        </p>
        <p style="color: #666;">
          <strong>Immunotherapy:</strong> 70% savings vs Western hospitals
        </p>
      </div>
      
      <div style="border: 2px solid #27ae60; border-radius: 12px; padding: 25px;">
        <h3 style="color: #27ae60; font-size: 24px; margin-bottom: 15px;">🧬 Advanced Treatments</h3>
        <p style="color: #666;">
          • Stem cell therapy protocols<br>
          • Immunotherapy infusions<br>
          • Disease-modifying treatments<br>
          • NABH hospital facilities
        </p>
      </div>
      
      <div style="border: 2px solid #27ae60; border-radius: 12px; padding: 25px;">
        <h3 style="color: #27ae60; font-size: 24px; margin-bottom: 15px;">⚡ No Waiting Lists</h3>
        <p style="color: #666;">
          Immediate treatment initiation vs months or years in public healthcare systems. 
          Private care at Indian prices.
        </p>
      </div>
      
      <div style="border: 2px solid #27ae60; border-radius: 12px; padding: 25px;">
        <h3 style="color: #27ae60; font-size: 24px; margin-bottom: 15px;">🌿 Ayurveda Integration</h3>
        <p style="color: #666;">
          <strong>Ayush Prana's PAMS Protocol</strong> for symptom management, 
          fatigue reduction, and quality of life improvement.
        </p>
      </div>
      
      <div style="border: 2px solid #27ae60; border-radius: 12px; padding: 25px;">
        <h3 style="color: #27ae60; font-size: 24px; margin-bottom: 15px;">🗣️ English-Speaking</h3>
        <p style="color: #666;">
          No language barriers. Medical team and coordinators 
          speak fluent English. Translation available for other languages.
        </p>
      </div>
      
      <div style="border: 2px solid #27ae60; border-radius: 12px; padding: 25px;">
        <h3 style="color: #27ae60; font-size: 24px; margin-bottom: 15px;">📱 Ongoing Care</h3>
        <p style="color: #666;">
          Telemedicine follow-up after returning home. 
          Coordination with local doctors abroad.
        </p>
      </div>
      
    </div>
  </div>
</section>

<!-- PAMS PROTOCOL SECTION -->
<section style="padding: 80px 20px; background: #f8f9fa;">
  <div style="max-width: 1000px; margin: 0 auto;">
    <h2 style="text-align: center; color: #1a5276; font-size: 36px; margin-bottom: 50px;">
      Our MS Treatment: The PAMS Protocol
    </h2>
    
    <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <p style="font-size: 18px; color: #333; line-height: 1.8; margin-bottom: 30px;">
        <strong>PAMS (Personalised Ayurvedic Management System)</strong> is our 
        specialised protocol for Multiple Sclerosis, combining modern neurology 
        with traditional Ayurvedic therapies. Developed over 20+ years with 
        2,500+ patient outcomes.
      </p>
      
      <h3 style="color: #27ae60; margin-bottom: 20px;">Treatment Components:</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <strong>Phase 1: Stabilisation</strong><br>
          <small>Medical assessment, treatment planning</small>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <strong>Phase 2: Immunomodulation</strong><br>
          <small>Immunotherapy, disease modification</small>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <strong>Phase 3: Panchakarma</strong><br>
          <small>Detox and cleansing therapies</small>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <strong>Phase 4: Rasayana</strong><br>
          <small>Rejuvenation and recovery</small>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 6. TREATMENT COMPARISON TABLE

### HTML — Reusable Component for Landing Pages

```html
<!-- TREATMENT COST COMPARISON TABLE -->

<section style="padding: 60px 20px; background: white;">
  <div style="max-width: 900px; margin: 0 auto;">
    <h2 style="text-align: center; color: #1a5276; font-size: 32px; margin-bottom: 40px;">
      Treatment Costs: India vs Your Country
    </h2>
    
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background: #1a5276; color: white;">
            <th style="padding: 15px; text-align: left;">Treatment</th>
            <th style="padding: 15px; text-align: center;">Your Country</th>
            <th style="padding: 15px; text-align: center; background: #2e86ab;">India</th>
            <th style="padding: 15px; text-align: center;">Savings</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #f8f9fa; border-bottom: 1px solid #eee;">
            <td style="padding: 12px;">Heart Bypass (CABG)</td>
            <td style="padding: 12px; text-align: center;">$40,000 - $60,000</td>
            <td style="padding: 12px; text-align: center; background: #e8f5e9; font-weight: bold;">$4,500 - $6,000</td>
            <td style="padding: 12px; text-align: center; color: #28a745;">75-85%</td>
          </tr>
          <tr style="background: white; border-bottom: 1px solid #eee;">
            <td style="padding: 12px;">Knee Replacement</td>
            <td style="padding: 12px; text-align: center;">$30,000 - $50,000</td>
            <td style="padding: 12px; text-align: center; background: #e8f5e9; font-weight: bold;">$4,000 - $7,000</td>
            <td style="padding: 12px; text-align: center; color: #28a745;">80-85%</td>
          </tr>
          <tr style="background: #f8f9fa; border-bottom: 1px solid #eee;">
            <td style="padding: 12px;">Hip Replacement</td>
            <td style="padding: 12px; text-align: center;">$35,000 - $50,000</td>
            <td style="padding: 12px; text-align: center; background: #e8f5e9; font-weight: bold;">$5,000 - $8,000</td>
            <td style="padding: 12px; text-align: center; color: #28a745;">80-85%</td>
          </tr>
          <tr style="background: white; border-bottom: 1px solid #eee;">
            <td style="padding: 12px;">IVF Cycle</td>
            <td style="padding: 12px; text-align: center;">$12,000 - $18,000</td>
            <td style="padding: 12px; text-align: center; background: #e8f5e9; font-weight: bold;">$2,500 - $4,000</td>
            <td style="padding: 12px; text-align: center; color: #28a745;">70-80%</td>
          </tr>
          <tr style="background: #f8f9fa; border-bottom: 1px solid #eee;">
            <td style="padding: 12px;">Spine Surgery</td>
            <td style="padding: 12px; text-align: center;">$60,000 - $100,000</td>
            <td style="padding: 12px; text-align: center; background: #e8f5e9; font-weight: bold;">$8,000 - $12,000</td>
            <td style="padding: 12px; text-align: center; color: #28a745;">85-88%</td>
          </tr>
          <tr style="background: white; border-bottom: 1px solid #eee;">
            <td style="padding: 12px;">Dental Implants (per tooth)</td>
            <td style="padding: 12px; text-align: center;">$3,000 - $5,000</td>
            <td style="padding: 12px; text-align: center; background: #e8f5e9; font-weight: bold;">$600 - $1,000</td>
            <td style="padding: 12px; text-align: center; color: #28a745;">70-80%</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px;">Cancer Treatment (full course)</td>
            <td style="padding: 12px; text-align: center;">$100,000 - $300,000</td>
            <td style="padding: 12px; text-align: center; background: #e8f5e9; font-weight: bold;">$15,000 - $40,000</td>
            <td style="padding: 12px; text-align: center; color: #28a745;">80-85%</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p style="text-align: center; margin-top: 15px; color: #666; font-size: 13px;">
      <em>* Costs are estimates. Get a personalised quote for your condition. Final price depends on hospital and treatment specifics.</em>
    </p>
  </div>
</section>
```

---

## 7. INLINE LEAD CAPTURE FORM

### HTML + Basic Form Styling — Add to Treatment Pages

```html
<!-- INLINE LEAD CAPTURE FORM -->

<section style="padding: 60px 20px; background: linear-gradient(135deg, #1a5276 0%, #2e86ab 100%);">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
    
    <h2 style="text-align: center; color: #1a5276; font-size: 28px; margin-bottom: 10px;">
      Get Your Free Treatment Plan
    </h2>
    <p style="text-align: center; color: #666; margin-bottom: 30px;">
      Fill this form and get a personalised treatment plan within 24 hours
    </p>
    
    <form action="#" method="POST" style="display: grid; gap: 20px;">
      
      <div>
        <label style="display: block; color: #333; font-weight: bold; margin-bottom: 5px; font-size: 14px;">
          Full Name *
        </label>
        <input type="text" name="name" required 
               style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div>
          <label style="display: block; color: #333; font-weight: bold; margin-bottom: 5px; font-size: 14px;">
            Country *
          </label>
          <select name="country" required 
                  style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px;">
            <option value="">Select country</option>
            <option value="Kenya">Kenya</option>
            <option value="Tanzania">Tanzania</option>
            <option value="Uganda">Uganda</option>
            <option value="Nigeria">Nigeria</option>
            <option value="UK">United Kingdom</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="UAE">UAE</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label style="display: block; color: #333; font-weight: bold; margin-bottom: 5px; font-size: 14px;">
            WhatsApp/Phone *
          </label>
          <input type="tel" name="phone" required 
                 placeholder="+254..."
                 style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
        </div>
      </div>
      
      <div>
        <label style="display: block; color: #333; font-weight: bold; margin-bottom: 5px; font-size: 14px;">
          Treatment Looking For *
        </label>
        <select name="treatment" required 
                style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px;">
          <option value="">Select treatment</option>
          <option value="cardiac">Cardiac (Heart Surgery)</option>
          <option value="orthopedic">Orthopedic (Joint Replacement)</option>
          <option value="oncology">Cancer Treatment</option>
          <option value="neurology">Neurology/Neurosurgery</option>
          <option value="ivf">IVF / Fertility</option>
          <option value="ms">Multiple Sclerosis</option>
          <option value="cosmetic">Cosmetic Surgery</option>
          <option value="dental">Dental Treatment</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div>
        <label style="display: block; color: #333; font-weight: bold; margin-bottom: 5px; font-size: 14px;">
          Additional Details (optional)
        </label>
        <textarea name="message" rows="3" 
                  placeholder="Briefly describe your condition or upload medical reports on WhatsApp"
                  style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; resize: vertical;"></textarea>
      </div>
      
      <button type="submit" 
              style="background: #1a5276; color: white; padding: 15px 30px; border: none; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; width: 100%; transition: background 0.3s;">
        Get Free Treatment Plan →
      </button>
      
    </form>
    
    <p style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
      🔒 Your information is secure and confidential. We never share your data.
    </p>
    
    <div style="text-align: center; margin-top: 20px;">
      <p style="color: #666; font-size: 14px;">Prefer WhatsApp?</p>
      <a href="https://wa.me/918089084080?text=Hello%2C%20I%20would%20like%20to%20get%20a%20free%20treatment%20plan" 
         style="background: #25D366; color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-weight: bold; display: inline-flex; align-items: center; gap: 8px;">
        💬 Chat on WhatsApp
      </a>
    </div>
    
  </div>
</section>
```

---

## 8. TESTIMONIAL CARD COMPONENT

### HTML — Reusable Testimonial Block

```html
<!-- PATIENT TESTIMONIAL CARD -->

<div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); margin-bottom: 20px;">
  <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
    <div style="width: 50px; height: 50px; border-radius: 50%; background: #1a5276; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px;">
      [Initials]
    </div>
    <div>
      <p style="font-weight: bold; color: #1a5276; margin: 0;">[Patient Name]</p>
      <p style="color: #666; margin: 0; font-size: 14px;">[Country] • [Treatment]</p>
    </div>
  </div>
  <p style="color: #555; font-style: italic; line-height: 1.6; margin: 0;">
    "[Testimonial quote. Example: The team made everything so easy. From the moment 
    I landed in Kochi, nothing was a problem. The hospital was excellent and the 
    Ayurveda recovery was exactly what I needed. I saved over $20,000 compared 
    to getting treated at home.]"
  </p>
  <div style="margin-top: 15px; color: #f39c12; font-size: 14px;">
    ★★★★★
  </div>
</div>
```

---

## 9. COST COMPARISON WIDGET

### HTML + CSS — Interactive Cost Calculator

```html
<!-- COST COMPARISON WIDGET -->

<section style="padding: 60px 20px; background: #f8f9fa;">
  <div style="max-width: 700px; margin: 0 auto;">
    
    <h2 style="text-align: center; color: #1a5276; font-size: 32px; margin-bottom: 15px;">
      How Much Can You Save?
    </h2>
    <p style="text-align: center; color: #666; margin-bottom: 40px;">
      Select your treatment to see estimated savings
    </p>
    
    <!-- Treatment Selector -->
    <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      
      <div style="margin-bottom: 25px;">
        <label style="display: block; color: #333; font-weight: bold; margin-bottom: 10px;">
          Select Treatment:
        </label>
        <select id="treatment-select" onchange="updateSavings()" 
                style="width: 100%; padding: 12px 15px; border: 2px solid #1a5276; border-radius: 8px; font-size: 16px;">
          <option value="cardiac">Heart Bypass Surgery</option>
          <option value="knee">Knee Replacement</option>
          <option value="ivf">IVF Treatment</option>
          <option value="spine">Spine Surgery</option>
          <option value="dental">Dental Implants</option>
          <option value="ms">MS Treatment (Stem Cell)</option>
        </select>
      </div>
      
      <!-- Results Display -->
      <div id="savings-results" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center;">
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
          <p style="color: #666; font-size: 14px; margin-bottom: 5px;">Your Country</p>
          <p id="cost-local" style="font-size: 24px; font-weight: bold; color: #e74c3c; margin: 0;">$45,000</p>
        </div>
        
        <div style="background: #e8f5e9; padding: 20px; border-radius: 12px;">
          <p style="color: #666; font-size: 14px; margin-bottom: 5px;">India</p>
          <p id="cost-india" style="font-size: 24px; font-weight: bold; color: #28a745; margin: 0;">$5,000</p>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 12px;">
          <p style="color: #666; font-size: 14px; margin-bottom: 5px;">You Save</p>
          <p id="cost-savings" style="font-size: 24px; font-weight: bold; color: #f39c12; margin: 0;">$40,000</p>
        </div>
        
      </div>
      
      <p style="text-align: center; margin-top: 20px; color: #666; font-size: 13px;">
        <em>These are estimates. Get your exact quote via WhatsApp.</em>
      </p>
      
    </div>
    
  </div>
</section>

<!-- JavaScript for Calculator -->
<script>
const treatmentData = {
  cardiac: { local: 45000, india: 5500, currency: 'USD' },
  knee: { local: 35000, india: 5500, currency: 'USD' },
  ivf: { local: 12000, india: 3000, currency: 'USD' },
  spine: { local: 80000, india: 10000, currency: 'USD' },
  dental: { local: 4000, india: 800, currency: 'USD' },
  ms: { local: 100000, india: 20000, currency: 'USD' }
};

function updateSavings() {
  const treatment = document.getElementById('treatment-select').value;
  const data = treatmentData[treatment];
  
  document.getElementById('cost-local').textContent = '$' + data.local.toLocaleString();
  document.getElementById('cost-india').textContent = '$' + data.india.toLocaleString();
  document.getElementById('cost-savings').textContent = '$' + (data.local - data.india).toLocaleString();
}
</script>
```

---

## 10. IMPLEMENTATION NOTES

### Where to Add Each Component

| Component | Where to Add | File to Edit |
|-----------|-------------|--------------|
| Partner Hospitals Section | Homepage, after hero | `index.html` |
| Ayush Prana Section | About page | `about.html` |
| Floating WhatsApp | All pages, before `</body>` | All HTML files |
| Country Landing (Kenya) | Create new file | `kenya.html` |
| Country Landing (UK) | Create new file | `uk.html` |
| MS Treatment Page | Update existing | `treatments/ayurveda.html` → rename/create `ms-treatment.html` |
| Treatment Comparison Table | Treatment pages | Individual treatment pages |
| Lead Capture Form | All treatment pages | Bottom of each treatment page |
| Testimonial Cards | Homepage, testimonials page | `index.html`, `testimonials.html` |
| Cost Calculator Widget | Homepage, landing pages | Insert where needed |

### Quick Deployment Checklist

- [ ] Add hospital logos (request from hospitals)
- [ ] Add Ayush Prana logo (request from them)
- [ ] Add WhatsApp icon image to `/assets/`
- [ ] Test all forms lead to actual email/inbox
- [ ] Check mobile responsiveness
- [ ] Add canonical URLs for new pages
- [ ] Update sitemap.xml for new pages

---

*Document: Website_Code_Snippets.md*  
*Version: 1.0 | June 2026*