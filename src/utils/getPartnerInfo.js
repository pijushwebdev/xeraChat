

export const getPartnerInfo = (participants, email) => {
    return participants.find(partner => partner?.email !== email);
}