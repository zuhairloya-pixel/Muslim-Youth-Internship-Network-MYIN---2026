export type MatchBreakdownItem = {
  label: string;
  earned: number;
  possible: number;
};

export type StudentProfile = {
  age: number;
  interests: string[];
  skills: string[];
  careerGoals: string[];
  availability: string[];
  location: string;
  formats: string[];
  opportunityTypes: string[];
};

export type MatchableOpportunity = {
  type: string;
  skills: string[];
  interests?: string[];
  careerGoals?: string[];
  availability?: string[];
  ageRange?: string;
  location: string;
  format: string;
};

const normalize = (value: string) => value.trim().toLowerCase();
const overlap = (left: string[], right: string[]) =>
  left.filter((item) =>
    right.some(
      (other) =>
        normalize(other).includes(normalize(item)) ||
        normalize(item).includes(normalize(other)),
    ),
  ).length;

function rangeAllows(ageRange: string | undefined, age: number) {
  if (!ageRange) {
    return true;
  }
  const numbers = ageRange.match(/\d+/g)?.map(Number) ?? [];
  if (numbers.length < 2) {
    return true;
  }
  return age >= Math.min(...numbers) && age <= Math.max(...numbers);
}

export function calculateMatch(
  student: StudentProfile,
  opportunity: MatchableOpportunity,
) {
  const requestedSkills = opportunity.skills.filter(Boolean);
  const matchedSkills = overlap(student.skills, requestedSkills);
  const eligible = rangeAllows(opportunity.ageRange, student.age);
  const items: MatchBreakdownItem[] = [
    {
      label: "Interests",
      earned: Math.round(
        (Math.min(
          overlap(student.interests, opportunity.interests ?? []),
          2,
        ) /
          2) *
          25,
      ),
      possible: 25,
    },
    {
      label: "Skills",
      earned: requestedSkills.length
        ? Math.round((matchedSkills / requestedSkills.length) * 20)
        : 10,
      possible: 20,
    },
    {
      label: "Career goals",
      earned: Math.round(
        Math.min(
          overlap(
            student.careerGoals,
            opportunity.careerGoals ?? opportunity.interests ?? [],
          ),
          1,
        ) * 15,
      ),
      possible: 15,
    },
    {
      label: "Availability",
      earned: opportunity.availability?.length
        ? Math.round(
            Math.min(
              overlap(student.availability, opportunity.availability),
              1,
            ) * 15,
          )
        : 8,
      possible: 15,
    },
    { label: "Eligibility", earned: eligible ? 10 : 0, possible: 10 },
    {
      label: "Location & format",
      earned:
        (student.formats.some(
          (format) => normalize(format) === normalize(opportunity.format),
        )
          ? 5
          : 0) +
        (normalize(opportunity.location).includes(
          normalize(student.location),
        ) || normalize(opportunity.location) === "anywhere"
          ? 5
          : 0),
      possible: 10,
    },
    {
      label: "Opportunity type",
      earned: student.opportunityTypes.some(
        (type) => normalize(type) === normalize(opportunity.type),
      )
        ? 5
        : 0,
      possible: 5,
    },
  ];
  const total = items.reduce((sum, item) => sum + item.earned, 0);
  const score = eligible ? total : Math.min(total, 25);
  const reasons = [
    matchedSkills
      ? `Your ${
          matchedSkills === 1
            ? "relevant skill"
            : `${matchedSkills} relevant skills`
        }`
      : "A chance to build new skills",
    eligible
      ? "Your age range is eligible"
      : "Age eligibility needs review before you can participate",
    items[3].earned
      ? "Your availability aligns"
      : "Confirm the schedule before committing",
  ];
  return { score, breakdown: items, reasons, eligible };
}
