// File: TermsAndConditions.jsx
import React, { useEffect } from 'react';
import './termsAndConditions.css';
import { Footer } from '../footer/footer';
import { Nav } from '../nav/nav';
import { New_breadCrumbs } from '../newCrumbs/newcrumbs';

export const TermsAndConditions = () => {
    const effectiveDate = 'October 13, 2025'; // demo date
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="terms-container-main">
            <Nav />
            <div className='breadCrumbs_div'>
                <New_breadCrumbs />
            </div>

            <main className="terms-container">
                <header className="terms-header">
                    <h1>Terms & Conditions</h1>
                    <p className="effective-date">Effective Date: {effectiveDate}</p>
                </header>

                <section className="terms-section">
                    These Terms & Conditions govern your access to and use of the Trading Diary platform operated by Cogent Devs.
By using the Platform, you agree to these terms.
1. Nature of the Platform
Trading Diary is a record-keeping and self-analysis tool.
The Platform:
•	Does not execute trades
•	Does not provide investment advice
•	Does not offer trading signals or recommendations
All decisions remain solely the responsibility of the user.
2. User Eligibility
You must:
•	Be at least 18 years old
•	Provide accurate account information
•	Use the Platform for lawful purposes only
3. User Responsibilities
Users are responsible for:
•	Accuracy of data they enter
•	Maintaining confidentiality of login credentials
•	Ensuring compliance with applicable laws and broker rules
Cogent Devs is not responsible for losses resulting from user decisions or incorrect data entry.
4. No Financial Advice Disclaimer
All content and tools provided are for informational and self-tracking purposes only.
Nothing on the Platform should be interpreted as:
•	Financial advice
•	Investment recommendations
•	Portfolio management services
Users should consult licensed professionals for financial decisions.
5. Intellectual Property
All platform content, software, design, and branding are the property of Cogent Devs.
Users may not:
•	Copy or reverse-engineer the platform
•	Redistribute or resell access
•	Use content without written permission
6. Service Availability
We aim for continuous availability but do not guarantee uninterrupted access.
We may:
•	Perform maintenance
•	Update features
•	Temporarily suspend services if required
7. Limitation of Liability
Cogent Devs shall not be liable for:
•	Financial losses
•	Trading outcomes
•	Data inaccuracies entered by users
•	Indirect or consequential damages
Use of the Platform is entirely at the user’s own risk.
8. Account Suspension or Termination
We reserve the right to:
•	Suspend or terminate accounts for misuse
•	Enforce platform rules
•	Protect system integrity and compliance
9. Modifications to Terms
We may revise these Terms & Conditions at any time. Continued use of the Platform constitutes acceptance of updated terms.
10. Governing Law
These Terms shall be governed by and interpreted in accordance with the laws of Islamic Republic of Pakistan.
11. Contact Information
For questions regarding these Terms:
Cogent Devs
Email: [support@yourdomain.com]

                </section>

                
            </main>
            <Footer />
        </div>

    );
};

