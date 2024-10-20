class SortTemplates {
    static GetForm = (template) => {
        return !!template.answers === true ? template.form : template;
    }

    static SortByDateAscending = (a, b) => {
        var firstForm = SortTemplates.GetForm(a);
        var secondForm = SortTemplates.GetForm(b);

        const firstDate = new Date(firstForm.date);
        const secondDate = new Date(secondForm.date);
    
        return firstDate - secondDate;
    }
    
    static SortByDateDescending = (a, b) => {
        var firstForm = SortTemplates.GetForm(a);
        var secondForm = SortTemplates.GetForm(b);

        const firstDate = new Date(firstForm.date);
        const secondDate = new Date(secondForm.date);
    
        return secondDate - firstDate;
    }

    static SortByPopularityAscending = (a, b) => {
        const firstForm = SortTemplates.GetForm(a);
        const secondForm = SortTemplates.GetForm(b);

        return secondForm.numberOfFills - firstForm.numberOfFills;
    }

    static SortByPopularityDescending = (a, b) => {
        const firstForm = SortTemplates.GetForm(a);
        const secondForm = SortTemplates.GetForm(b);

        return firstForm.numberOfFills - secondForm.numberOfFills;
    }
}

export default SortTemplates;