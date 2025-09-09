trait TestTrait {
    abstract fun traitMethod(): Int;
    abstract fun anotherMethod(): Bool;
}

contract Test with TestTrait {
    init() {}
    
    fun traitMethod(): Int {
        return 42;
    }
    
    fun anotherMethod(): Bool {
        return true;
    }
    
    fun test() {
        let result = self.traitMetho1d(); // Should suggest "traitMethod" 
        let result2 = self.anotherMetho1d(); // Should suggest "anotherMethod"
    }
    
    receive() {}
}