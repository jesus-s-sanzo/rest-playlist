
subjectList = [];
add = (subjectName) => {
    subject = { name: subjectName, date: today() };
    subjectList.push(subject);
    sortByDate();
};

get = (subjectName) => {
    subject = subjectList.find(subjectIterator => subjectIterator.name.includes(subjectName));
    return subject;
};

list = () => subjectList;

remove = (subjectName) => {
    prevSize = subjectList.length;
    subjectList = subjectList.filter(item => item.name !== subjectName);
    return prevSize - subjectList.length > 0;
};

toString = () => {
    let now = today();
    let result = 'Your subjects are: ';
    let lines = subjectList.map(subject => {
        let daysAgo = daysDiff(subject.date, now);
        return `${subject.name}, studied ${daysAgo == 0 ? 'today' : daysAgo == 1 ? 'yesterday' : daysAgo + ' day ago'}`;
    })
    result += lines.slice(0, -1).join(', ') + ', and ' + lines.slice(-1);
    return result;
};

suggest = () => {
    let subject = subjectList[ 0 ];
    let daysAgo = daysDiff(subject.date, today());
    let suggestion = subject ? `You should study ${subject.name}, last studied ${daysAgo == 0 ? 'today' : daysAgo + ' days ago'}`
        : 'you have no subjects registered, try adding some to track and suggest';
    return suggestion;
};

sortByDate = function () {
    subjectList.sort((a, b) => (a.date.getTime() > b.date.getTime()) ? 1 : -1)
};

init = (initialList) => {
    subjectList = initialList;
    sortByDate();
};

today = () => new Date((new Date()).toDateString());

daysDiff = function (date1, date2) { return Math.round((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)) };

module.exports = {
    'add': add,
    'remove': remove,
    'toString': toString,
    'suggest': suggest,
    'init': init
};