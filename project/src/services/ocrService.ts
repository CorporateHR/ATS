import * as pdfjsLib from "pdfjs-dist";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ResumeData {
  name?: string;
  email?: string;
  mobile?: string;
  current_job_title?: string;
  experience_years?: number;
  city?: string;
  state?: string;
}

export async function processResume(file: File): Promise<ResumeData> {
  try {
    // Validate file type
    if (file.type !== 'application/pdf') {
      throw new Error('Invalid file type. Only PDF files are supported.');
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // Extract text from all pages
    let extractedText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text from all text items
      const pageText = textContent.items
        .map(item => 'str' in item ? item.str : '')
        .join(' ');
      
      extractedText += pageText + '\n';
    }

    // Parse extracted text
    const resumeData = parseResumeText(extractedText);

    return resumeData;
  } catch (error) {
    console.error('PDF Processing Error:', error);
    throw error;
  }
}

function parseResumeText(text: string): ResumeData {
  const resumeData: ResumeData = {};

  // Clean and normalize text
  const cleanedText = text
    .replace(/\s+/g, ' ')
    .replace(/[^\x00-\x7F]/g, '')  // Remove non-ASCII characters
    .trim();

  // Email extraction
  const emailPatterns = [
    /[\w.-]+@[\w.-]+\.\w+/,
    /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/
  ];
  for (const pattern of emailPatterns) {
    const emailMatch = cleanedText.match(pattern);
    if (emailMatch) {
      resumeData.email = emailMatch[0];
      break;
    }
  }

  // Phone number extraction
  const phonePatterns = [
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,
    /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  ];
  for (const pattern of phonePatterns) {
    const phoneMatch = cleanedText.match(pattern);
    if (phoneMatch) {
      resumeData.mobile = phoneMatch[0];
      break;
    }
  }

  // Name extraction
  const namePatterns = [
    /^([A-Z][a-z]+ [A-Z][a-z]+)/,
    /Name:\s*([A-Z][a-z]+ [A-Z][a-z]+)/i,
    /^([A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+)/
  ];
  for (const pattern of namePatterns) {
    const nameMatch = cleanedText.match(pattern);
    if (nameMatch) {
      resumeData.name = nameMatch[1];
      break;
    }
  }

  // Current job title extraction
  const jobTitlePatterns = [
    /Current\s*(?:Job\s*)?(?:Title|Position):\s*([^\n]+)/i,
    /Designation:\s*([^\n]+)/i,
    /Current\s*Role:\s*([^\n]+)/i
  ];
  for (const pattern of jobTitlePatterns) {
    const jobTitleMatch = cleanedText.match(pattern);
    if (jobTitleMatch) {
      resumeData.current_job_title = jobTitleMatch[1].trim();
      break;
    }
  }

  // Experience extraction
  const experiencePatterns = [
    /Total\s*Experience:\s*(\d+)\s*(?:years?|yrs?)/i,
    /Years?\s*of\s*Experience:\s*(\d+)/i,
    /Experience:\s*(\d+)\s*(?:years?|yrs?)/i
  ];
  for (const pattern of experiencePatterns) {
    const experienceMatch = cleanedText.match(pattern);
    if (experienceMatch) {
      resumeData.experience_years = parseInt(experienceMatch[1], 10);
      break;
    }
  }

  // Location extraction
  const locationPatterns = [
    /(?:Location|City):\s*([A-Za-z\s]+),\s*([A-Za-z\s]+)/i,
    /Address:\s*[^,]+,\s*([A-Za-z\s]+),\s*([A-Za-z\s]+)/i
  ];
  for (const pattern of locationPatterns) {
    const locationMatch = cleanedText.match(pattern);
    if (locationMatch) {
      resumeData.city = locationMatch[1].trim();
      resumeData.state = locationMatch[2].trim();
      break;
    }
  }

  return resumeData;
}
